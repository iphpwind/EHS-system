/**
 * 验证码临时存储（内存）
 * 生产环境建议使用 Redis
 */

const captchaStore = new Map<string, { text: string; expireAt: number }>();

const CAPTCHA_TTL = 5 * 60 * 1000; // 5分钟有效期

export function setCaptcha(uuid: string, text: string): void {
  captchaStore.set(uuid, { text: text.toLowerCase(), expireAt: Date.now() + CAPTCHA_TTL });
}

export function getCaptcha(uuid: string): string | undefined {
  const item = captchaStore.get(uuid);
  if (!item) return undefined;
  if (Date.now() > item.expireAt) {
    captchaStore.delete(uuid);
    return undefined;
  }
  return item.text;
}

export function deleteCaptcha(uuid: string): void {
  captchaStore.delete(uuid);
}

// 定期清理过期验证码（每10分钟）
setInterval(() => {
  const now = Date.now();
  for (const [uuid, item] of captchaStore.entries()) {
    if (now > item.expireAt) {
      captchaStore.delete(uuid);
    }
  }
}, 10 * 60 * 1000);
