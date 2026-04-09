const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from current directory
app.use(express.static(__dirname));
app.use(express.json());

// Store users and connections
const waitingUsers = new Set();
const activeConnections = new Map();
const onlineUsers = new Map(); // userId -> {socket, username, joinedAt}
const groupChatMessages = [];
const privateChats = new Map(); // userId -> Map<targetUserId, messages>

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Generate unique user ID
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    socket.userId = userId;
    
    // Add to online users with default username (will be updated after registration)
    onlineUsers.set(userId, {
        socket: socket,
        username: `Guest_${userId.substr(5, 4)}`,
        joinedAt: new Date()
    });
    
    // Send user ID and username to client
    socket.emit('user-info', { 
        userId: userId, 
        username: onlineUsers.get(userId).username 
    });
    
    // Send online users count
    io.emit('online-users-count', onlineUsers.size);
    
    // Send recent group chat messages
    socket.emit('group-chat-history', groupChatMessages.slice(-50));
    
    // Handle user looking for partner
    socket.on('find-partner', () => {
        console.log(`User ${userId} looking for partner`);
        
        // Remove from waiting if already there
        waitingUsers.delete(socket);
        
        // Find another waiting user
        const waitingUserArray = Array.from(waitingUsers);
        
        if (waitingUserArray.length > 0) {
            // Found a partner
            const partnerSocket = waitingUserArray[0];
            const partnerId = partnerSocket.userId;
            
            // Remove partner from waiting list
            waitingUsers.delete(partnerSocket);
            
            // Create connection
            activeConnections.set(socket, partnerSocket);
            activeConnections.set(partnerSocket, socket);
            
            // Notify both users with usernames
            const user1Info = onlineUsers.get(userId);
            const user2Info = onlineUsers.get(partnerId);
            
            socket.emit('partner-found', { 
                partnerId: partnerId, 
                partnerUsername: user2Info.username,
                isInitiator: true 
            });
            partnerSocket.emit('partner-found', { 
                partnerId: userId, 
                partnerUsername: user1Info.username,
                isInitiator: false 
            });
            
            console.log(`Matched: ${userId} <-> ${partnerId}`);
        } else {
            // No partner available, add to waiting list
            waitingUsers.add(socket);
            socket.emit('searching');
            console.log(`User ${userId} added to waiting list`);
        }
    });
    
    // Handle WebRTC signaling
    socket.on('signal', (data) => {
        const partnerSocket = activeConnections.get(socket);
        if (partnerSocket) {
            partnerSocket.emit('signal', {
                signal: data.signal,
                from: userId
            });
        }
    });
    
    // Handle skip/disconnect
    socket.on('skip', () => {
        console.log(`User ${userId} wants to skip`);
        
        const partnerSocket = activeConnections.get(socket);
        if (partnerSocket) {
            // Notify partner
            partnerSocket.emit('partner-skipped');
            
            // Clean up connection
            activeConnections.delete(socket);
            activeConnections.delete(partnerSocket);
            
            // Both users start searching again
            socket.emit('searching');
            partnerSocket.emit('searching');
            
            // Add both to waiting list
            waitingUsers.add(socket);
            waitingUsers.add(partnerSocket);
        }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
        
        // Remove from online users
        onlineUsers.delete(userId);
        
        // Remove from waiting list
        waitingUsers.delete(socket);
        
        // Notify partner if in active connection
        const partnerSocket = activeConnections.get(socket);
        if (partnerSocket) {
            partnerSocket.emit('partner-disconnected');
            activeConnections.delete(socket);
            activeConnections.delete(partnerSocket);
            
            // Add partner back to waiting list
            waitingUsers.add(partnerSocket);
            partnerSocket.emit('searching');
        }
        
        // Clean up
        activeConnections.delete(socket);
        privateChats.delete(userId);
        
        // Update online users count
        io.emit('online-users-count', onlineUsers.size);
    });
    
    // Handle chat messages
    socket.on('chat-message', (message) => {
        const partnerSocket = activeConnections.get(socket);
        if (partnerSocket) {
            const userInfo = onlineUsers.get(userId);
            partnerSocket.emit('chat-message', {
                message: message,
                from: userId,
                fromUsername: userInfo.username
            });
        }
    });
    
    // Handle group chat messages
    socket.on('group-chat-message', (message) => {
        const userInfo = onlineUsers.get(userId);
        const chatMessage = {
            id: Date.now(),
            message: message,
            from: userId,
            fromUsername: userInfo.username,
            timestamp: new Date()
        };
        
        // Add to history
        groupChatMessages.push(chatMessage);
        
        // Keep only last 100 messages
        if (groupChatMessages.length > 100) {
            groupChatMessages.shift();
        }
        
        // Broadcast to all online users
        io.emit('group-chat-message', chatMessage);
    });
    
    // Handle private chat messages
    socket.on('private-chat-message', ({ targetUserId, message }) => {
        const targetUser = onlineUsers.get(targetUserId);
        const userInfo = onlineUsers.get(userId);
        
        if (targetUser && userInfo) {
            const chatMessage = {
                id: Date.now(),
                message: message,
                from: userId,
                fromUsername: userInfo.username,
                timestamp: new Date()
            };
            
            // Send to target user
            targetUser.socket.emit('private-chat-message', chatMessage);
            
            // Send copy to sender
            socket.emit('private-chat-message', chatMessage);
            
            // Store in private chat history
            if (!privateChats.has(userId)) {
                privateChats.set(userId, new Map());
            }
            if (!privateChats.has(targetUserId)) {
                privateChats.set(targetUserId, new Map());
            }
            
            privateChats.get(userId).set(targetUserId, chatMessage);
            privateChats.get(targetUserId).set(userId, chatMessage);
        }
    });
    
    // Handle username change (from registration)
    socket.on('update-username', (newUsername) => {
        if (newUsername && newUsername.trim().length > 0 && newUsername.length <= 20) {
            const userInfo = onlineUsers.get(userId);
            if (userInfo) {
                userInfo.username = newUsername.trim();
                
                // Broadcast username change
                socket.emit('username-updated', newUsername);
                io.emit('online-users-count', onlineUsers.size);
                
                console.log(`Username updated for ${userId}: ${newUsername}`);
            }
        }
    });
    
    // Handle manual username change
    socket.on('change-username', (newUsername) => {
        if (newUsername && newUsername.trim().length > 0 && newUsername.length <= 20) {
            const userInfo = onlineUsers.get(userId);
            if (userInfo) {
                userInfo.username = newUsername.trim();
                
                // Broadcast username change
                socket.emit('username-changed', newUsername);
                io.emit('online-users-count', onlineUsers.size);
            }
        }
    });
    
    // Handle get online users list
    socket.on('get-online-users', () => {
        const usersList = Array.from(onlineUsers.entries()).map(([id, info]) => ({
            userId: id,
            username: info.username,
            joinedAt: info.joinedAt
        }));
        socket.emit('online-users-list', usersList);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Knorrie Porrie Video Chat Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    console.log(`Ready for random video chats!`);
});
