/**
 * SSE (Server-Sent Events) 连接管理器
 * 用于实时推送安全预警、待办事项等通知
 */

interface SSEClient {
  id: string;
  userId: number;
  response: any;
  lastPing: number;
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;

  constructor() {
    // 每30秒发送一次心跳
    this.pingInterval = setInterval(() => this.sendHeartbeat(), 30000);
  }

  /**
   * 添加 SSE 客户端连接
   */
  addClient(clientId: string, userId: number, response: any): void {
    // 设置 SSE 响应头
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization',
    });

    // 发送初始连接成功消息
    this.sendToClient(clientId, 'connected', { message: '连接成功' });

    this.clients.set(clientId, {
      id: clientId,
      userId,
      response,
      lastPing: Date.now()
    });

    console.log(`✅ SSE 客户端连接: ${clientId}, 当前连接数: ${this.clients.size}`);
  }

  /**
   * 移除 SSE 客户端连接
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        client.response.end();
      } catch (e) {
        // 忽略关闭错误
      }
      this.clients.delete(clientId);
      console.log(`❌ SSE 客户端断开: ${clientId}, 当前连接数: ${this.clients.size}`);
    }
  }

  /**
   * 发送消息给指定客户端
   */
  sendToClient(clientId: string, event: string, data: any): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;

    try {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      client.response.write(message);
      return true;
    } catch (error) {
      console.error(`发送消息失败 (${clientId}):`, error);
      this.removeClient(clientId);
      return false;
    }
  }

  /**
   * 发送消息给指定用户的所有连接
   */
  sendToUser(userId: number, event: string, data: any): void {
    this.clients.forEach((client, clientId) => {
      if (client.userId === userId) {
        this.sendToClient(clientId, event, data);
      }
    });
  }

  /**
   * 广播消息给所有连接的客户端
   */
  broadcast(event: string, data: any): void {
    this.clients.forEach((client, clientId) => {
      this.sendToClient(clientId, event, data);
    });
  }

  /**
   * 发送心跳包
   */
  private sendHeartbeat(): void {
    const now = Date.now();
    const timeout = 60000; // 60秒超时

    this.clients.forEach((client, clientId) => {
      if (now - client.lastPing > timeout) {
        // 超时断开
        console.log(`⏰ SSE 客户端超时: ${clientId}`);
        this.removeClient(clientId);
      } else {
        // 发送心跳
        this.sendToClient(clientId, 'ping', { timestamp: now });
      }
    });
  }

  /**
   * 获取当前连接统计
   */
  getStats(): { total: number; users: number } {
    const userIds = new Set<number>();
    this.clients.forEach(client => userIds.add(client.userId));
    
    return {
      total: this.clients.size,
      users: userIds.size
    };
  }

  /**
   * 清理资源
   */
  destroy(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.clients.clear();
  }
}

// 单例模式
const sseManager = new SSEManager();

export default sseManager;
