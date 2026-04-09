// Firebase Database Operations voor Epstein United

class DatabaseManager {
    constructor() {
        this.db = window.firebaseDB;
        this.registrationsCollection = 'registrations';
        this.statisticsCollection = 'statistics';
    }

    // Nieuwe registratie toevoegen
    async addRegistration(registrationData) {
        try {
            const docRef = await this.db.collection(this.registrationsCollection).add({
                ...registrationData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: new Date().toISOString(),
                status: 'active'
            });
            
            // Update statistieken
            await this.updateStatistics();
            
            return {
                success: true,
                id: docRef.id,
                message: 'Aanmelding succesvol opgeslagen!'
            };
        } catch (error) {
            console.error('Error adding registration:', error);
            return {
                success: false,
                error: error.message,
                message: 'Er is een fout opgetreden bij het opslaan van de aanmelding.'
            };
        }
    }

    // Alle registraties ophalen
    async getAllRegistrations() {
        try {
            const snapshot = await this.db
                .collection(this.registrationsCollection)
                .orderBy('timestamp', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting registrations:', error);
            return [];
        }
    }

    // Recente registraties ophalen (laatste 10)
    async getRecentRegistrations(limit = 10) {
        try {
            const snapshot = await this.db
                .collection(this.registrationsCollection)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting recent registrations:', error);
            return [];
        }
    }

    // Real-time listener voor registraties
    onRegistrationsUpdate(callback) {
        return this.db
            .collection(this.registrationsCollection)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .onSnapshot((snapshot) => {
                const registrations = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(registrations);
            }, (error) => {
                console.error('Real-time listener error:', error);
            });
    }

    // Statistieken ophalen
    async getStatistics() {
        try {
            const docRef = this.db.collection(this.statisticsCollection).doc('current');
            const doc = await docRef.get();
            
            if (doc.exists) {
                return doc.data();
            } else {
                // Initieel statistieken document aanmaken
                const initialStats = {
                    totalMembers: 247,
                    activeParticipants: 189,
                    newMembers: 23,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                };
                await docRef.set(initialStats);
                return initialStats;
            }
        } catch (error) {
            console.error('Error getting statistics:', error);
            return {
                totalMembers: 247,
                activeParticipants: 189,
                newMembers: 23
            };
        }
    }

    // Statistieken bijwerken
    async updateStatistics() {
        try {
            const registrations = await this.getAllRegistrations();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const newMembers = registrations.filter(reg => 
                reg.timestamp && reg.timestamp.toDate() > thirtyDaysAgo
            ).length;
            
            const stats = {
                totalMembers: 247 + registrations.length,
                activeParticipants: 189 + Math.floor(registrations.length * 0.8),
                newMembers: 23 + newMembers,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await this.db.collection(this.statisticsCollection).doc('current').set(stats);
            return stats;
        } catch (error) {
            console.error('Error updating statistics:', error);
            return null;
        }
    }

    // Real-time listener voor statistieken
    onStatisticsUpdate(callback) {
        return this.db
            .collection(this.statisticsCollection)
            .doc('current')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    callback(doc.data());
                }
            });
    }

    // Registratie verwijderen (admin functie)
    async deleteRegistration(registrationId) {
        try {
            await this.db.collection(this.registrationsCollection).doc(registrationId).delete();
            await this.updateStatistics();
            return { success: true, message: 'Registratie verwijderd' };
        } catch (error) {
            console.error('Error deleting registration:', error);
            return { success: false, error: error.message };
        }
    }

    // Registratie bijwerken
    async updateRegistration(registrationId, updateData) {
        try {
            await this.db.collection(this.registrationsCollection).doc(registrationId).update({
                ...updateData,
                lastModified: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, message: 'Registratie bijgewerkt' };
        } catch (error) {
            console.error('Error updating registration:', error);
            return { success: false, error: error.message };
        }
    }

    // Zoeken in registraties
    async searchRegistrations(searchTerm) {
        try {
            const snapshot = await this.db
                .collection(this.registrationsCollection)
                .get();
            
            const results = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter(reg => 
                reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.activity.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            return results;
        } catch (error) {
            console.error('Error searching registrations:', error);
            return [];
        }
    }
}

// Globale database manager instantie
window.dbManager = new DatabaseManager();