import puppeteer from 'puppeteer-core';
import path from 'path';

// Windows 常见 Chrome 路径（本机部署）
const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
];

function findChrome(): string | undefined {
  const fs = require('fs');
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

export interface HotWorkPDFData {
  ticketNo: string;
  ticketType: string;
  statusText: string;
  applicantName: string;
  deptName: string;
  projectName: string;
  workLocation: string;
  workContent: string;
  fireLevelText: string;
  fireArea: string;
  fireType: string;
  riskAnalysis: string;
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  gasChecks: any[];
  signatures: any[];
  approvals: any[];
  // GB 30871-2022 合规字段
  safetyDisclosureText?: string;  // 安全交底文本
  disclosureTime?: string;     // 交底时间
  guardianSignature?: string; // 监护人签字
}

/**
 * 生成 GB30871 动火作业票 PDF
 */
export async function generateHotWorkPDF(data: HotWorkPDFData): Promise<Uint8Array> {
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error('未找到 Chrome 浏览器，请安装 Google Chrome');
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 构建签字区域HTML
  const buildSignRow = (label: string, signPath?: string) => {
    if (signPath) {
      return `<tr><td class="label">${label}</td><td class="sign-cell"><img src="${process.env.API_BASE_URL || 'http://192.168.1.19:3001'}/api${signPath}" class="sign-img" /></td></tr>`;
    }
    return `<tr><td class="label">${label}</td><td class="sign-cell"></td></tr>`;
  };

  const gasRows = (data.gasChecks || []).map((g: any) => `
    <tr>
      <td>${g.check_type === 'before' ? '作业前' : g.check_type === 'during' ? '作业中' : '作业后'}</td>
      <td>${g.check_time ? new Date(g.check_time).toLocaleString() : ''}</td>
      <td>${g.oxygen_percent}%</td>
      <td>${g.flammable_percent}%LEL</td>
      <td>${g.toxic_ppm}ppm(${g.toxic_type || ''})</td>
      <td>${g.check_result === 1 ? '合格' : '不合格'}</td>
      <td>${g.checker_name || ''}</td>
    </tr>
  `).join('');

  const approvalRows = (data.approvals || []).map((a: any) => `
    <tr>
      <td>${a.node_name || ''}</td>
      <td>${a.approver_name || ''}</td>
      <td>${a.approval_result === 'approve' ? '通过' : '驳回'}</td>
      <td>${a.approval_opinion || ''}</td>
      <td>${a.approval_time ? new Date(a.approval_time).toLocaleString() : ''}</td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>动火作业许可证 - ${data.ticketNo}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "SimSun", "宋体", serif; font-size: 14px; color: #000; padding: 20px; }
  .title { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 16px; letter-spacing: 4px; }
  .sub-title { text-align: center; font-size: 12px; color: #666; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  td, th { border: 1px solid #333; padding: 6px 8px; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .label { width: 120px; background: #fafafa; font-weight: bold; }
  .sign-cell { width: 160px; height: 50px; text-align: center; }
  .sign-img { max-width: 140px; max-height: 40px; }
  .section-title { font-weight: bold; font-size: 15px; margin: 12px 0 6px; padding-left: 4px; border-left: 4px solid #c00; }
  .status-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; background: #e6f7ff; border: 1px solid #1890ff; color: #1890ff; }
  .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="title">动 火 作 业 许 可 证</div>
  <div class="sub-title">依据 GB 30871-2022 《危险化学品企业特殊作业安全规范》</div>

  <table>
    <tr>
      <td class="label">票号</td><td>${data.ticketNo}</td>
      <td class="label">状态</td><td><span class="status-badge">${data.statusText}</span></td>
    </tr>
    <tr>
      <td class="label">申请部门</td><td>${data.deptName || ''}</td>
      <td class="label">申请人</td><td>${data.applicantName || ''}</td>
    </tr>
    <tr>
      <td class="label">动火等级</td><td>${data.fireLevelText || ''}</td>
      <td class="label">动火方式</td><td>${data.fireType || ''}</td>
    </tr>
    <tr>
      <td class="label">动火区域</td><td colspan="3">${data.fireArea || ''}</td>
    </tr>
    <tr>
      <td class="label">作业地点</td><td colspan="3">${data.workLocation || ''}</td>
    </tr>
    <tr>
      <td class="label">作业内容</td><td colspan="3">${data.workContent || ''}</td>
    </tr>
    <tr>
      <td class="label">计划时间</td><td colspan="3">${data.startTime || ''} 至 ${data.endTime || ''}</td>
    </tr>
    <tr>
      <td class="label">实际时间</td><td colspan="3">${data.actualStartTime || '——'} 至 ${data.actualEndTime || '——'}</td>
    </tr>
  </table>

  <div class="section-title">安全交底记录 (GB 30871-2022)</div>
  <table>
    <tr>
      <td class="label">交底时间</td>
      <td>${data.disclosureTime || '——'}</td>
    </tr>
    <tr>
      <td class="label">交底内容</td>
      <td>${data.safetyDisclosureText || '（无）'}</td>
    </tr>
    ${buildSignRow('监护人签字', data.guardianSignature)}
  </table>

  <div class="section-title">风险分析</div>
  <table>
    <tr><td colspan="2">${data.riskAnalysis || '（无）'}</td></tr>
    ${buildSignRow('风险分析人签字', data.signatures.find((s: any) => s.sign_type === 'risk_analysis')?.sign_image)}
    ${buildSignRow('安全交底人签字', data.signatures.find((s: any) => s.sign_type === 'safety_disclosure')?.sign_image)}
  </table>

  <div class="section-title">气体检测记录</div>
  <table>
    <thead>
      <tr>
        <th>时机</th><th>检测时间</th><th>氧气%</th><th>可燃气体%LEL</th><th>有毒气体ppm</th><th>结果</th><th>检测人</th>
      </tr>
    </thead>
    <tbody>
      ${gasRows || '<tr><td colspan="7" style="text-align:center;color:#999">暂无检测记录</td></tr>'}
    </tbody>
  </table>

  <div class="section-title">审批记录</div>
  <table>
    <thead>
      <tr><th>节点</th><th>审批人</th><th>结果</th><th>意见</th><th>时间</th></tr>
    </thead>
    <tbody>
      ${approvalRows || '<tr><td colspan="5" style="text-align:center;color:#999">暂无审批记录</td></tr>'}
    </tbody>
  </table>

  <div class="section-title">现场签字确认</div>
  <table>
    ${buildSignRow('作业负责人签字', data.signatures.find((s: any) => s.sign_type === 'responsible')?.sign_image)}
    ${buildSignRow('监护人签字', data.signatures.find((s: any) => s.sign_type === 'guardian')?.sign_image)}
    ${buildSignRow('动火人签字', data.signatures.find((s: any) => s.sign_type === 'fire_worker')?.sign_image)}
    ${buildSignRow('验收人签字', data.signatures.find((s: any) => s.sign_type === 'acceptance')?.sign_image)}
  </table>

  <div class="footer">
    本作业票依据 GB 30871-2022 生成 | 打印时间：${new Date().toLocaleString()}
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  });

  await browser.close();
  return pdf;
}
