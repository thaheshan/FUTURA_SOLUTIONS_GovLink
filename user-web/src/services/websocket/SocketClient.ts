/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/socket/SocketService.ts
import io from 'socket.io-client';

interface ServerToClientEvents {
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
  new_application: (application: { id: string; [key: string]: any }) => void;
  status_update: (update: { id: string; status: string; [key: string]: any }) => void;
}

interface ClientToServerEvents {
  // Define client-to-server events here if needed
}

class SocketService {
  private socket: ReturnType<typeof io> | null = null;

  connect(): void {
    this.socket = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('adminToken'),
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
    });

    this.socket.on('new_application', (application: any) => {
      // Dispatch event globally for real-time updates
      window.dispatchEvent(
        new CustomEvent('newApplication', { detail: application })
      );
    });

    this.socket.on('status_update', (update: any) => {
      // Dispatch status update event
      window.dispatchEvent(
        new CustomEvent('statusUpdate', { detail: update })
      );
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected manually');
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket is not connected.');
    }
  }
}

export const socketService = new SocketService();