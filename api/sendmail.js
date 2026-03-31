module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: 'RESEND_API_KEY not set' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { to, name, company, job, score, label, quickWins, humanCore, redesignTitle, redesignDesc, nextStep } = body;

    if (!to) return res.status(400).json({ error: 'No recipient' });

    const quickWinsHtml = (quickWins || []).map(w =>
      `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eaf0;">
          <strong style="color:#111;">${w.task}</strong><br>
          <span style="color:#666;font-size:13px;">${w.why}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eaf0;text-align:right;white-space:nowrap;">
          <span style="color:#2ea87e;font-size:13px;">주 ${w.hours_saved}h 절감</span><br>
          <span style="color:#999;font-size:12px;">${w.timeline}</span>
        </td>
      </tr>`
    ).join('');

    const humanCoreHtml = (humanCore || []).map(h =>
      `<li style="padding:8px 0;border-bottom:1px solid #e8eaf0;color:#555;">
        <strong style="color:#111;">${h.task}</strong> — ${h.why}
      </li>`
    ).join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'Helvetica Neue',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- 헤더 -->
    <div style="background:#fff;border-radius:12px 12px 0 0;padding:32px 32px 24px;border-bottom:2px solid #f0f0f0;">
      <div style="font-size:11px;letter-spacing:3px;color:#3b6fd4;margin-bottom:8px;">DEEPLOY</div>
      <div style="font-size:22px;font-weight:800;color:#111;">AI 전환 준비도 진단 결과</div>
    </div>

    <!-- 인사 -->
    <div style="background:#fff;padding:24px 32px;">
      <p style="color:#111;font-size:15px;line-height:1.7;margin:0 0 24px;">
        <strong style="color:#111;">${name}님</strong>, 진단이 완료됐습니다.<br>
        ${company}의 ${job} 직무 분석 결과를 아래에서 확인하세요.
      </p>
    </div>

    <!-- 준비도 스코어 -->
    <div style="background:#fff;padding:0 32px 24px;">
      <div style="background:#f8f9fc;border:1px solid #e8eaf0;border-radius:12px;padding:28px;text-align:center;">
        <div style="font-size:11px;letter-spacing:3px;color:#888;margin-bottom:12px;">AI 전환 준비도</div>
        <div style="font-size:64px;font-weight:900;color:#3b6fd4;line-height:1;">${score}</div>
        <div style="font-size:13px;color:#888;margin-top:4px;">/ 100점</div>
        <div style="display:inline-block;margin-top:12px;padding:6px 18px;border-radius:20px;background:rgba(59,111,212,.1);border:1px solid rgba(59,111,212,.3);color:#3b6fd4;font-size:13px;font-weight:700;">${label}</div>
      </div>
    </div>

    <!-- 즉시 위임 가능 태스크 -->
    <div style="background:#fff;padding:0 32px 24px;">
      <div style="border:1px solid #e8eaf0;border-radius:10px;overflow:hidden;">
        <div style="background:#f8f9fc;padding:14px 16px;font-size:11px;letter-spacing:2px;color:#3b6fd4;font-weight:700;">즉시 에이전트에 맡길 수 있는 것</div>
        <table style="width:100%;border-collapse:collapse;">
          ${quickWinsHtml}
        </table>
      </div>
    </div>

    <!-- 인간 전담 판단 -->
    <div style="background:#fff;padding:0 32px 24px;">
      <div style="border:1px solid #d4edda;border-radius:10px;overflow:hidden;">
        <div style="background:#f0faf4;padding:14px 16px;font-size:11px;letter-spacing:2px;color:#2ea87e;font-weight:700;">당신만이 할 수 있는 판단</div>
        <ul style="list-style:none;padding:8px 16px;margin:0;">
          ${humanCoreHtml}
        </ul>
      </div>
    </div>

    <!-- 새로운 직무 정의 -->
    <div style="background:#fff;padding:0 32px 24px;">
      <div style="background:linear-gradient(135deg,#ebf0ff,#f0faf4);border:1px solid #c5d5f5;border-radius:10px;padding:24px;">
        <div style="font-size:11px;letter-spacing:2px;color:#3b6fd4;margin-bottom:10px;">✦ 새로운 직무 정의</div>
        <div style="font-size:18px;font-weight:800;color:#111;margin-bottom:8px;">${redesignTitle}</div>
        <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 14px;">${redesignDesc}</p>
        <div style="border-top:1px solid #c5d5f5;padding-top:12px;color:#3b6fd4;font-size:13px;">
          → 첫 번째 액션: ${nextStep}
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="background:#fff;padding:0 32px 32px;text-align:center;border-radius:0 0 12px 12px;">
      <a href="https://www.jdxwork.com/jd"
         style="display:inline-block;padding:14px 32px;background:#3b6fd4;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">
        AI 시대 새로운 역할 JD 만들기 →
      </a>
      <div style="margin-top:10px;font-size:12px;color:#999;">₩3,000 · 진단 결과 기반 자동 생성</div>
    </div>

    <!-- 푸터 -->
    <div style="padding:20px;text-align:center;">
      <div style="font-size:13px;font-weight:800;letter-spacing:3px;color:#333;margin-bottom:6px;">DEEPLOY</div>
      <div style="font-size:12px;color:#999;">www.deeploy.site</div>
    </div>

  </div>
</body>
</html>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`
      },
      body: JSON.stringify({
        from: 'JDXwork <noreply@jdxwork.com>',
        to: [to],
        subject: `[JDXwork] ${name}님의 AI 전환 준비도 진단 결과 — ${score}점 (${label})`,
        html
      })
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Resend error:', result);
      return res.status(response.status).json({ error: result.message || 'Send failed' });
    }

    return res.status(200).json({ success: true, id: result.id });

  } catch (e) {
    console.error('Sendmail error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};
