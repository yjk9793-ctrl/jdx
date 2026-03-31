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
        <td style="padding:10px 12px;border-bottom:1px solid #1e2333;">
          <strong style="color:#f0eee8;">${w.task}</strong><br>
          <span style="color:#8a9ab5;font-size:13px;">${w.why}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #1e2333;text-align:right;white-space:nowrap;">
          <span style="color:#2ea87e;font-size:13px;">주 ${w.hours_saved}h 절감</span><br>
          <span style="color:#8a9ab5;font-size:12px;">${w.timeline}</span>
        </td>
      </tr>`
    ).join('');

    const humanCoreHtml = (humanCore || []).map(h =>
      `<li style="padding:8px 0;border-bottom:1px solid #1e2333;color:#8a9ab5;">
        <strong style="color:#f0eee8;">${h.task}</strong> — ${h.why}
      </li>`
    ).join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#07080a;font-family:'Helvetica Neue',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- 헤더 -->
    <div style="margin-bottom:32px;">
      <div style="font-size:12px;letter-spacing:3px;color:#7aabf0;margin-bottom:8px;">DEEPLOY · JDXwork</div>
      <div style="font-size:22px;font-weight:800;color:#f0eee8;">AI 전환 준비도 진단 결과</div>
    </div>

    <!-- 인사 -->
    <p style="color:#8a9ab5;font-size:15px;line-height:1.7;margin-bottom:28px;">
      <strong style="color:#f0eee8;">${name}님</strong>, 진단이 완료됐습니다.<br>
      ${company}의 ${job} 직무 분석 결과를 아래에서 확인하세요.
    </p>

    <!-- 준비도 스코어 -->
    <div style="background:#0f1114;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:28px;margin-bottom:20px;text-align:center;">
      <div style="font-size:11px;letter-spacing:3px;color:#8a9ab5;margin-bottom:12px;">AI 전환 준비도</div>
      <div style="font-size:64px;font-weight:900;color:#7aabf0;line-height:1;">${score}</div>
      <div style="font-size:13px;color:#8a9ab5;margin-top:4px;">/ 100점</div>
      <div style="display:inline-block;margin-top:12px;padding:6px 18px;border-radius:20px;background:rgba(59,111,212,.15);border:1px solid rgba(59,111,212,.3);color:#7aabf0;font-size:13px;font-weight:700;">${label}</div>
    </div>

    <!-- 즉시 위임 가능 태스크 -->
    <div style="background:#0f1114;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:2px;color:#7aabf0;margin-bottom:16px;">즉시 에이전트에 맡길 수 있는 것</div>
      <table style="width:100%;border-collapse:collapse;">
        ${quickWinsHtml}
      </table>
    </div>

    <!-- 인간 전담 판단 -->
    <div style="background:#0f1114;border:1px solid rgba(46,168,126,.2);border-radius:12px;padding:24px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:2px;color:#2ea87e;margin-bottom:16px;">당신만이 할 수 있는 판단</div>
      <ul style="list-style:none;padding:0;margin:0;">
        ${humanCoreHtml}
      </ul>
    </div>

    <!-- 새로운 직무 정의 -->
    <div style="background:linear-gradient(135deg,rgba(59,111,212,.12),rgba(46,168,126,.06));border:1px solid rgba(59,111,212,.25);border-radius:12px;padding:24px;margin-bottom:28px;">
      <div style="font-size:11px;letter-spacing:2px;color:#7aabf0;margin-bottom:10px;">✦ 새로운 직무 정의</div>
      <div style="font-size:18px;font-weight:800;color:#f0eee8;margin-bottom:8px;">${redesignTitle}</div>
      <p style="color:#8a9ab5;font-size:14px;line-height:1.7;margin:0 0 14px;">${redesignDesc}</p>
      <div style="border-top:1px solid rgba(59,111,212,.2);padding-top:12px;color:#7aabf0;font-size:13px;">
        → 첫 번째 액션: ${nextStep}
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://www.jdxwork.com" 
         style="display:inline-block;padding:14px 32px;background:#3b6fd4;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">
        AI 시대 새로운 역할 JD 만들기 →
      </a>
      <div style="margin-top:10px;font-size:12px;color:#6b7a99;">₩3,000 · 진단 결과 기반 자동 생성</div>
    </div>

    <!-- 푸터 -->
    <div style="border-top:1px solid rgba(255,255,255,.06);padding-top:20px;text-align:center;">
      <div style="font-size:12px;letter-spacing:2px;color:#6b7a99;margin-bottom:6px;">DEEPLOY · JDXwork</div>
      <div style="font-size:12px;color:#6b7a99;">www.jdxwork.com · yjk9793@gmail.com</div>
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
