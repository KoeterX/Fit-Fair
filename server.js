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

// Store waiting users and active connections
const waitingUsers = new Set();
const activeConnections = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Generate unique user ID
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    socket.userId = userId;
    
    // Send user ID to client
    socket.emit('user-id', userId);
    
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
            
            // Notify both users
            socket.emit('partner-found', { partnerId: partnerId, isInitiator: true });
            partnerSocket.emit('partner-found', { partnerId: userId, isInitiator: false });
            
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
    });
    
    // Handle chat messages
    socket.on('chat-message', (message) => {
        const partnerSocket = activeConnections.get(socket);
        if (partnerSocket) {
            partnerSocket.emit('chat-message', {
                message: message,
                from: userId
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Knorrie Porrie Video Chat Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    console.log(`Ready for random video chats!`);
});
