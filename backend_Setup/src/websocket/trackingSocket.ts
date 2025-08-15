import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { jwtService } from '../services/auth/jwtService';
import config from '../config/environment';

export class TrackingSocket {
  private io: SocketIOServer;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: config.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    console.log('✅ WebSocket server initialized');
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Authentication for protected rooms
      socket.on('authenticate', async (token: string) => {
        try {
          const decoded = jwtService.verifyAccessToken(token);
          socket.data.user = decoded;
          socket.emit('authenticated', { success: true });
          console.log(`Client ${socket.id} authenticated as ${decoded.email}`);
        } catch (error) {
          socket.emit('authentication_error', { error: 'Invalid token' });
        }
      });

      // Join application tracking room (public)
      socket.on('track-application', (referenceNumber: string) => {
        if (referenceNumber) {
          socket.join(`application-${referenceNumber}`);
          socket.emit('tracking-started', { referenceNumber });
          console.log(`Client ${socket.id} tracking application ${referenceNumber}`);
        }
      });

      // Stop tracking application
      socket.on('stop-tracking', (referenceNumber: string) => {
        socket.leave(`application-${referenceNumber}`);
        socket.emit('tracking-stopped', { referenceNumber });
      });

      // Join officer dashboard room (protected)
      socket.on('join-officer-dashboard', (officerId: string) => {
        if (socket.data.user && socket.data.user.role === 'officer') {
          socket.join(`officer-${officerId}`);
          socket.emit('dashboard-joined', { officerId });
        } else {
          socket.emit('access-denied', { error: 'Officer access required' });
        }
      });

      // Join admin dashboard room (protected)
      socket.on('join-admin-dashboard', () => {
        if (socket.data.user && socket.data.user.role === 'admin') {
          socket.join('admin-dashboard');
          socket.emit('admin-dashboard-joined', { success: true });
        } else {
          socket.emit('access-denied', { error: 'Admin access required' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  // Broadcast application status update
  public broadcastApplicationStatusUpdate(referenceNumber: string, statusData: any): void {
    this.io.to(`application-${referenceNumber}`).emit('application-status-update', {
      referenceNumber,
      ...statusData,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast appointment updates
  public broadcastAppointmentUpdate(applicationId: string, appointmentData: any): void {
    this.io.to(`application-${applicationId}`).emit('appointment-update', {
      applicationId,
      ...appointmentData,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast to officer dashboard
  public broadcastToOfficer(officerId: string, event: string, data: any): void {
    this.io.to(`officer-${officerId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast to admin dashboard
  public broadcastToAdmins(event: string, data: any): void {
    this.io.to('admin-dashboard').emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Send notification to specific user
  public sendNotificationToUser(userId: string, notification: any): void {
    // This would require maintaining user-socket mapping
    this.io.emit('user-notification', {
      userId,
      notification,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast system-wide announcements
  public broadcastSystemAnnouncement(message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'): void {
    this.io.emit('system-announcement', {
      message,
      priority,
      timestamp: new Date().toISOString()
    });
  }

  // Get connected clients count
  public getConnectedClientsCount(): number {
    return this.io.engine.clientsCount;
  }

  // Get room information
  public getRoomInfo(): any {
    const rooms = this.io.sockets.adapter.rooms;
    const roomInfo: any = {};
    
    rooms.forEach((sockets, room) => {
      if (!room.startsWith('/')) { // Filter out internal rooms
        roomInfo[room] = sockets.size;
      }
    });
    
    return roomInfo;
  }
}

export let trackingSocket: TrackingSocket;

export const initializeWebSocket = (server: HTTPServer): TrackingSocket => {
  trackingSocket = new TrackingSocket(server);
  return trackingSocket;
};