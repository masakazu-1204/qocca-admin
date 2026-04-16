import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

// ── Supabase Client ───────────────────────────────────────────────────────
const supabase = createClient(
  "https://qufrqkuipzuqeqkvuhkx.supabase.co",
  "sb_publishable_TWEGFx7kfggQffOSzs31Jg_J3yYZqou"
);

// ── Theme ─────────────────────────────────────────────────────────────────
const T = {
  orange: "#F5A94A", orangeLight: "#FAC97A", orangePale: "#FFF3E0",
  orangeDeep: "#E8903A", cream: "#FAFAF7", dark: "#1A1208",
  darkBrown: "#2D1F0A", warmGray: "#9E9B95", lightGray: "#F5F3F0",
  border: "#EDE9E3", white: "#FFFFFF", green: "#4CAF50", greenPale: "#E8F5E9",
  blue: "#2196F3", bluePale: "#E3F2FD", red: "#EF5350", redPale: "#FFEBEE",
  purple: "#9C27B0", purplePale: "#F3E5F5", sidebar: "#0F0B04", sideHover: "#1E1708",
};

// ── Mock Data ─────────────────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month:"1月", revenue:12400, orders:8, users:45 },
  { month:"2月", revenue:18600, orders:12, users:62 },
  { month:"3月", revenue:31200, orders:21, users:98 },
  { month:"4月", revenue:28900, orders:19, users:87 },
  { month:"5月", revenue:42100, orders:28, users:134 },
  { month:"6月", revenue:55300, orders:37, users:178 },
  { month:"7月", revenue:48700, orders:32, users:156 },
  { month:"8月", revenue:63200, orders:42, users:203 },
  { month:"9月", revenue:71800, orders:48, users:245 },
  { month:"10月", revenue:82400, orders:55, users:287 },
  { month:"11月", revenue:95600, orders:64, users:342 },
  { month:"12月", revenue:108200, orders:72, users:398 },
];

const CATEGORY_DATA = [
  { name:"似顔絵", value:35, color:T.orange },
  { name:"お洋服", value:18, color:T.purple },
  { name:"フォト", value:15, color:T.blue },
  { name:"グッズ", value:20, color:T.green },
  { name:"フード", value:8, color:T.red },
  { name:"しつけ", value:4, color:T.orangeDeep },
];

const PENDING_LISTINGS = [
  { id:101, title:"愛犬のアクリル画", seller:"アートスタジオK", sellerEmail:"art-k@email.com", price:5500, category:"似顔絵", pet:"dog", date:"2026.04.11", status:"pending", desc:"アクリル絵の具で描く本格的なペット肖像画。A3サイズ。", images:3 },
  { id:102, title:"猫用オーガニックおやつ", seller:"ナチュラルキャット", sellerEmail:"natcat@email.com", price:2800, category:"フード", pet:"cat", date:"2026.04.11", status:"pending", desc:"国産オーガニック素材のみ使用した猫用おやつセット。", images:5 },
  { id:103, title:"ペット用レインコート", seller:"ペットファッションLab", sellerEmail:"petfab@email.com", price:4200, category:"お洋服", pet:"both", date:"2026.04.10", status:"pending", desc:"完全防水・反射テープ付きのオシャレなレインコート。", images:4 },
  { id:104, title:"犬猫メモリアルフォトブック", seller:"メモリーズ", sellerEmail:"memories@email.com", price:15000, category:"フォト", pet:"both", date:"2026.04.10", status:"pending", desc:"プロ仕上げの高品質フォトブック。20ページ構成。", images:6 },
  { id:105, title:"うちの子LINEスタンプ", seller:"スタンプ工房", sellerEmail:"stamp@email.com", price:6000, category:"似顔絵", pet:"both", date:"2026.04.09", status:"pending", desc:"ペットの写真から16種類のLINEスタンプを制作。", images:2 },
];

const USERS = [
  { id:1, name:"田中みかん", email:"mikan@email.com", role:"seller", joined:"2026.01.15", listings:8, sales:42, revenue:168000, status:"active", provider:"email" },
  { id:2, name:"佐藤ゆき", email:"yuki@email.com", role:"buyer", joined:"2026.02.03", listings:0, sales:0, revenue:0, status:"active", provider:"google" },
  { id:3, name:"鈴木けんた", email:"kenta@email.com", role:"seller", joined:"2026.01.28", listings:5, sales:28, revenue:112000, status:"active", provider:"twitter" },
  { id:4, name:"高橋まるこ", email:"maruko@email.com", role:"buyer", joined:"2026.03.12", listings:0, sales:0, revenue:0, status:"active", provider:"email" },
  { id:5, name:"伊藤そら", email:"sora@email.com", role:"seller", joined:"2026.02.20", listings:3, sales:15, revenue:67500, status:"active", provider:"google" },
  { id:6, name:"渡辺たく", email:"taku@email.com", role:"seller", joined:"2026.03.05", listings:6, sales:31, revenue:139500, status:"suspended", provider:"email" },
  { id:7, name:"山本あい", email:"ai@email.com", role:"buyer", joined:"2026.04.01", listings:0, sales:0, revenue:0, status:"active", provider:"twitter" },
  { id:8, name:"中村りお", email:"rio@email.com", role:"seller", joined:"2026.01.10", listings:12, sales:89, revenue:356000, status:"active", provider:"email" },
];

const REPORTS = [
  { id:1, type:"🐾 生体動物の売買", target:"子犬販売セット", reporter:"匿名ユーザー", date:"2026.04.12", status:"new", severity:"high", desc:"生体動物の売買に該当する可能性があります。" },
  { id:2, type:"💬 外部誘導", target:"格安似顔絵サービス", reporter:"田中みかん", date:"2026.04.11", status:"new", severity:"medium", desc:"LINEへの誘導を行っており、プラットフォーム外取引の疑い。" },
  { id:3, type:"🎭 なりすまし", target:"プロフォト撮影会", reporter:"佐藤ゆき", date:"2026.04.11", status:"investigating", severity:"high", desc:"他の撮影者の作品を無断使用している疑い。" },
  { id:4, type:"💰 詐欺", target:"激安バースデーケーキ", reporter:"鈴木けんた", date:"2026.04.10", status:"investigating", severity:"high", desc:"注文後に連絡が取れなくなったとの報告。" },
  { id:5, type:"⚠️ 著作権侵害", target:"キャラクターグッズ制作", reporter:"匿名ユーザー", date:"2026.04.09", status:"resolved", severity:"medium", desc:"有名キャラクターの無断使用。対応済み：出品削除。" },
  { id:6, type:"🔞 不適切", target:"ペット写真加工", reporter:"高橋まるこ", date:"2026.04.08", status:"resolved", severity:"low", desc:"不適切な画像加工。対応済み：警告送付。" },
];

const PENDING_EVENTS = [
  { id:1, title:"わんこマルシェ in 横浜", organizer:"横浜ペット愛好会", date:"2026.05.18", place:"横浜赤レンガ倉庫", pet:"dog", fee:"無料", submitted:"2026.04.11", status:"pending", desc:"ハンドメイドペットグッズの販売イベント。ドッグランも併設。" },
  { id:2, title:"猫の譲渡会＆相談会", organizer:"にゃんこレスキュー", date:"2026.05.25", place:"品川区民センター", pet:"cat", fee:"無料", submitted:"2026.04.10", status:"pending", desc:"保護猫の譲渡会と獣医師による健康相談。" },
  { id:3, title:"ペットヨガ体験会", organizer:"Zen Pet Studio", date:"2026.06.01", place:"代官山スタジオ", pet:"both", fee:"3,000円", submitted:"2026.04.09", status:"pending", desc:"ペットと一緒にヨガ体験。少人数制・要予約。" },
];

// ── Refund / Trouble Data ─────────────────────────────────────────────────
const REFUND_CASES = [
  { id:1001, orderId:"QOC-2026-0412", item:"愛犬の水彩似顔絵", buyer:"佐藤ゆき", buyerEmail:"yuki@email.com", seller:"みかん工房", sellerEmail:"mikan@email.com", amount:3800, reason:"納品物がイメージと大きく異なる", date:"2026.04.12", status:"new", escrow:"held", timeline:[
    { date:"2026.04.05", action:"注文確定", by:"system" },
    { date:"2026.04.09", action:"出品者が納品", by:"みかん工房" },
    { date:"2026.04.10", action:"購入者が異議申し立て", by:"佐藤ゆき" },
    { date:"2026.04.12", action:"返金申請を受付", by:"system" },
  ]},
  { id:1002, orderId:"QOC-2026-0398", item:"猫ちゃん専用ニット服", buyer:"高橋まるこ", buyerEmail:"maruko@email.com", seller:"てづくり屋さん", sellerEmail:"tedukuri@email.com", amount:5200, reason:"サイズが注文と異なる（M→S）", date:"2026.04.11", status:"investigating", escrow:"held", timeline:[
    { date:"2026.04.01", action:"注文確定", by:"system" },
    { date:"2026.04.08", action:"出品者が発送", by:"てづくり屋さん" },
    { date:"2026.04.10", action:"購入者が受取・異議", by:"高橋まるこ" },
    { date:"2026.04.11", action:"調査開始・出品者に確認連絡", by:"admin" },
  ]},
  { id:1003, orderId:"QOC-2026-0385", item:"しつけ個別相談60分", buyer:"山本あい", buyerEmail:"ai@email.com", seller:"ドッグトレーナー山本", sellerEmail:"trainer@email.com", amount:6000, reason:"予約時間にトレーナーが現れなかった", date:"2026.04.10", status:"investigating", escrow:"held", timeline:[
    { date:"2026.04.07", action:"注文確定", by:"system" },
    { date:"2026.04.10 10:00", action:"相談予約時刻", by:"system" },
    { date:"2026.04.10 10:30", action:"購入者から「接続できない」報告", by:"山本あい" },
    { date:"2026.04.10 14:00", action:"出品者から「体調不良で連絡遅れた」連絡", by:"ドッグトレーナー山本" },
  ]},
  { id:1004, orderId:"QOC-2026-0310", item:"アクリルキーホルダー", buyer:"鈴木けんた", buyerEmail:"kenta@email.com", seller:"クリエイトパレット", sellerEmail:"create@email.com", amount:2200, reason:"商品が届かない（発送後2週間経過）", date:"2026.04.08", status:"refunded", escrow:"released_buyer", timeline:[
    { date:"2026.03.25", action:"注文確定", by:"system" },
    { date:"2026.03.26", action:"出品者が発送", by:"クリエイトパレット" },
    { date:"2026.04.08", action:"配送事故と判断・全額返金実行", by:"admin" },
  ]},
  { id:1005, orderId:"QOC-2026-0295", item:"デジタル似顔絵（即日）", buyer:"伊藤そら", buyerEmail:"sora@email.com", seller:"イラスト工房ハル", sellerEmail:"haru@email.com", amount:1500, reason:"購入者都合のキャンセル", date:"2026.04.05", status:"rejected", escrow:"released_seller", timeline:[
    { date:"2026.04.05", action:"注文確定", by:"system" },
    { date:"2026.04.05", action:"出品者が即日納品", by:"イラスト工房ハル" },
    { date:"2026.04.05", action:"購入者がキャンセル申請", by:"伊藤そら" },
    { date:"2026.04.05", action:"納品済みのため返金却下", by:"admin" },
  ]},
];

// ── Support Tickets Data ──────────────────────────────────────────────────
const SUPPORT_TICKETS = [
  { id:2001, user:"佐藤ゆき", email:"yuki@email.com", subject:"返金の進捗を教えてください", category:"返金", priority:"high", status:"open", created:"2026.04.12 09:30", messages:[
    { from:"user", name:"佐藤ゆき", text:"先日返金申請した水彩似顔絵の件ですが、進捗はいかがでしょうか？イメージと全然違うものが届いて困っています。", time:"2026.04.12 09:30" },
    { from:"admin", name:"サポート", text:"お問い合わせありがとうございます。ただいま出品者に確認中です。48時間以内に結果をご連絡いたします。", time:"2026.04.12 10:15" },
    { from:"user", name:"佐藤ゆき", text:"ありがとうございます。お待ちしています。", time:"2026.04.12 10:22" },
  ]},
  { id:2002, user:"田中みかん", email:"mikan@email.com", subject:"出品が承認されません", category:"出品", priority:"medium", status:"open", created:"2026.04.11 14:00", messages:[
    { from:"user", name:"田中みかん", text:"3日前に出品したアクリル画がまだ承認されていません。何か問題がありましたでしょうか？", time:"2026.04.11 14:00" },
  ]},
  { id:2003, user:"鈴木けんた", email:"kenta@email.com", subject:"Stripe連携がうまくいかない", category:"技術", priority:"high", status:"open", created:"2026.04.11 11:20", messages:[
    { from:"user", name:"鈴木けんた", text:"Stripe Connectの連携ページでエラーが出ます。「アカウント認証に失敗しました」と表示されます。", time:"2026.04.11 11:20" },
    { from:"admin", name:"サポート", text:"ご不便をおかけして申し訳ございません。Stripeダッシュボードでの本人確認は完了していますか？", time:"2026.04.11 13:00" },
    { from:"user", name:"鈴木けんた", text:"はい、本人確認は済んでいます。スクリーンショットを添付します。", time:"2026.04.11 13:15" },
  ]},
  { id:2004, user:"高橋まるこ", email:"maruko@email.com", subject:"注文した商品のサイズ交換", category:"注文", priority:"low", status:"resolved", created:"2026.04.09 16:45", messages:[
    { from:"user", name:"高橋まるこ", text:"ニット服のサイズがSで届きましたが、Mで注文したはずです。交換は可能ですか？", time:"2026.04.09 16:45" },
    { from:"admin", name:"サポート", text:"確認いたしました。出品者に交換対応を依頼しました。着払い伝票をお送りしますので、返送をお願いいたします。", time:"2026.04.10 09:00" },
    { from:"user", name:"高橋まるこ", text:"ありがとうございます！返送しました。", time:"2026.04.11 10:30" },
    { from:"admin", name:"サポート", text:"返送を確認しました。新しいMサイズを出品者が発送済みです。到着まで3-5日ほどお待ちください。", time:"2026.04.11 15:00" },
  ]},
  { id:2005, user:"匿名", email:"anon@email.com", subject:"不審な出品者について", category:"通報", priority:"medium", status:"open", created:"2026.04.10 08:00", messages:[
    { from:"user", name:"匿名", text:"「格安似顔絵サービス」という出品者がLINEに誘導してきます。プラットフォーム外取引を持ちかけられました。", time:"2026.04.10 08:00" },
  ]},
];

const REPLY_TEMPLATES = [
  { id:1, label:"📋 受付確認", text:"お問い合わせいただきありがとうございます。内容を確認し、順次対応いたします。通常48時間以内にご回答いたしますので、今しばらくお待ちください。" },
  { id:2, label:"🔍 調査中", text:"現在、本件について調査を進めております。状況が分かり次第ご連絡いたします。追加情報がございましたら、このチャットでお知らせください。" },
  { id:3, label:"💰 返金承認", text:"確認の結果、返金対応とさせていただきます。Stripeを通じて3-5営業日以内にご返金いたします。ご不便をおかけし申し訳ございませんでした。" },
  { id:4, label:"❌ 返金不可", text:"確認いたしましたが、利用規約に基づき、納品完了後のキャンセル・返金は対応いたしかねます。ご了承ください。ご不明な点がございましたらお気軽にご連絡ください。" },
  { id:5, label:"⚠️ 規約違反警告", text:"お客様の行為が利用規約に抵触する可能性がございます。繰り返される場合、アカウント制限措置を取らせていただく場合がございます。ご理解ください。" },
  { id:6, label:"✅ 解決報告", text:"本件は対応が完了いたしました。他にお困りのことがございましたら、お気軽にお問い合わせください。Qoccaをご利用いただきありがとうございます🐾" },
];

// ── Sidebar ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"dashboard", icon:"📊", label:"ダッシュボード" },
  { id:"listings", icon:"📦", label:"出品審査", badge:PENDING_LISTINGS.filter(l=>l.status==="pending").length },
  { id:"users", icon:"👥", label:"ユーザー管理" },
  { id:"reports", icon:"🚨", label:"通報管理", badge:REPORTS.filter(r=>r.status==="new").length },
  { id:"events", icon:"📅", label:"イベント審査", badge:PENDING_EVENTS.filter(e=>e.status==="pending").length },
  { id:"revenue", icon:"💰", label:"売上分析" },
  { id:"refunds", icon:"🔄", label:"返金・トラブル", badge:REFUND_CASES.filter(r=>r.status==="new"||r.status==="investigating").length },
  { id:"support", icon:"💬", label:"サポート", badge:SUPPORT_TICKETS.filter(t=>t.status==="open").length },
];

const Sidebar = ({ active, setActive }) => (
  <div style={{
    width:240, background:T.sidebar, minHeight:"100vh", position:"fixed",
    left:0, top:0, display:"flex", flexDirection:"column", zIndex:100,
    borderRight:`1px solid rgba(245,169,74,0.08)`
  }}>
    <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:10, background:`linear-gradient(135deg, ${T.orange}, ${T.orangeDeep})`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:18
        }}>🐨</div>
        <div>
          <div style={{ fontSize:17, fontWeight:900, color:T.orange, letterSpacing:"-0.5px" }}>Qocca</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.1em" }}>ADMIN PANEL</div>
        </div>
      </div>
    </div>

    <nav style={{ flex:1, padding:"12px 10px" }}>
      {NAV_ITEMS.map(item => (
        <button key={item.id} onClick={()=>setActive(item.id)} style={{
          width:"100%", padding:"11px 14px", border:"none", borderRadius:10,
          background: active===item.id ? `rgba(245,169,74,0.12)` : "transparent",
          color: active===item.id ? T.orange : "rgba(255,255,255,0.5)",
          fontWeight: active===item.id ? 800 : 600, fontSize:13.5, cursor:"pointer",
          textAlign:"left", display:"flex", alignItems:"center", gap:11,
          fontFamily:"inherit", marginBottom:2, transition:"all 0.15s",
          borderLeft: active===item.id ? `3px solid ${T.orange}` : "3px solid transparent"
        }}>
          <span style={{ fontSize:18, width:24, textAlign:"center" }}>{item.icon}</span>
          <span style={{ flex:1 }}>{item.label}</span>
          {item.badge > 0 && (
            <span style={{
              background:T.red, color:"#fff", fontSize:10, fontWeight:800,
              padding:"2px 7px", borderRadius:10, minWidth:18, textAlign:"center"
            }}>{item.badge}</span>
          )}
        </button>
      ))}
    </nav>

    <div style={{ padding:"16px 14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:34, height:34, borderRadius:"50%", background:T.orange,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:800, color:"#fff"
        }}>M</div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>masakazu</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>管理者</div>
        </div>
      </div>
    </div>
  </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, bg }) => (
  <div style={{
    background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}`,
    flex:1, minWidth:180, position:"relative", overflow:"hidden"
  }}>
    <div style={{ position:"absolute", top:-8, right:-8, fontSize:60, opacity:0.04 }}>{icon}</div>
    <div style={{
      width:42, height:42, borderRadius:12, background:bg||T.orangePale,
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:12
    }}>{icon}</div>
    <div style={{ fontSize:12, color:T.warmGray, fontWeight:600, marginBottom:4 }}>{label}</div>
    <div style={{ fontSize:28, fontWeight:900, color:color||T.dark, letterSpacing:"-1px" }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:T.green, fontWeight:700, marginTop:4 }}>{sub}</div>}
  </div>
);

// ── Dashboard Page ────────────────────────────────────────────────────────
const DashboardPage = ({ setActive }) => {
  const totalRevenue = MONTHLY_REVENUE.reduce((s,m)=>s+m.revenue,0);
  const totalOrders = MONTHLY_REVENUE.reduce((s,m)=>s+m.orders,0);
  const pendingCount = PENDING_LISTINGS.filter(l=>l.status==="pending").length;
  const newReports = REPORTS.filter(r=>r.status==="new").length;

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>ダッシュボード</h1>
        <p style={{ fontSize:13, color:T.warmGray }}>Qoccaの運営状況を一目で確認</p>
      </div>

      <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
        <StatCard icon="💰" label="累計売上" value={`¥${totalRevenue.toLocaleString()}`} sub="↑ 23.4% 前月比" color={T.orange}/>
        <StatCard icon="📦" label="累計取引" value={totalOrders} sub="↑ 18.2% 前月比" bg={T.bluePale}/>
        <StatCard icon="👥" label="登録ユーザー" value={`${USERS.length}人`} sub="↑ 12 今月" bg={T.greenPale}/>
        <StatCard icon="🚨" label="未対応通報" value={newReports} color={newReports>0?T.red:T.green} bg={newReports>0?T.redPale:T.greenPale}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:28 }}>
        {/* Revenue Chart */}
        <div style={{ background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:16 }}>📈 月間売上推移</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.orange} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={T.orange} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:T.warmGray }}/>
              <YAxis tick={{ fontSize:11, fill:T.warmGray }} tickFormatter={v=>`¥${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v)=>[`¥${v.toLocaleString()}`,"売上"]} contentStyle={{ borderRadius:10, border:`1px solid ${T.border}`, fontSize:12 }}/>
              <Area type="monotone" dataKey="revenue" stroke={T.orange} strokeWidth={2.5} fill="url(#gOrange)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div style={{ background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:16 }}>🐾 カテゴリ別出品</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={(v)=>[`${v}%`]} contentStyle={{ borderRadius:10, border:`1px solid ${T.border}`, fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
            {CATEGORY_DATA.map(c=>(
              <div key={c.name} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:c.color }}/>
                <span style={{ fontSize:10, color:T.warmGray, fontWeight:600 }}>{c.name} {c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
        <button onClick={()=>setActive("listings")} style={{
          background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}`,
          cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"box-shadow 0.2s"
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:24 }}>📦</span>
            {pendingCount > 0 && <span style={{ background:T.orange, color:"#fff", fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:10 }}>{pendingCount}件待ち</span>}
          </div>
          <div style={{ fontSize:14, fontWeight:800, color:T.dark }}>出品審査</div>
          <div style={{ fontSize:11, color:T.warmGray, marginTop:4 }}>承認待ちの出品を確認 →</div>
        </button>
        <button onClick={()=>setActive("reports")} style={{
          background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}`,
          cursor:"pointer", textAlign:"left", fontFamily:"inherit"
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:24 }}>🚨</span>
            {newReports > 0 && <span style={{ background:T.red, color:"#fff", fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:10 }}>{newReports}件</span>}
          </div>
          <div style={{ fontSize:14, fontWeight:800, color:T.dark }}>通報確認</div>
          <div style={{ fontSize:11, color:T.warmGray, marginTop:4 }}>未対応の通報を確認 →</div>
        </button>
        <button onClick={()=>setActive("events")} style={{
          background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}`,
          cursor:"pointer", textAlign:"left", fontFamily:"inherit"
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:24 }}>📅</span>
            <span style={{ background:T.blue, color:"#fff", fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:10 }}>{PENDING_EVENTS.filter(e=>e.status==="pending").length}件</span>
          </div>
          <div style={{ fontSize:14, fontWeight:800, color:T.dark }}>イベント審査</div>
          <div style={{ fontSize:11, color:T.warmGray, marginTop:4 }}>投稿されたイベントを確認 →</div>
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <button onClick={()=>setActive("refunds")} style={{
          background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}`,
          cursor:"pointer", textAlign:"left", fontFamily:"inherit"
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:24 }}>🔄</span>
            <span style={{ background:T.orangePale, color:T.orange, fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:10 }}>{REFUND_CASES.filter(r=>r.status==="new"||r.status==="investigating").length}件対応中</span>
          </div>
          <div style={{ fontSize:14, fontWeight:800, color:T.dark }}>返金・トラブル</div>
          <div style={{ fontSize:11, color:T.warmGray, marginTop:4 }}>返金申請・エスクロー管理 →</div>
        </button>
        <button onClick={()=>setActive("support")} style={{
          background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}`,
          cursor:"pointer", textAlign:"left", fontFamily:"inherit"
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:24 }}>💬</span>
            <span style={{ background:T.purplePale, color:T.purple, fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:10 }}>{SUPPORT_TICKETS.filter(t=>t.status==="open").length}件未解決</span>
          </div>
          <div style={{ fontSize:14, fontWeight:800, color:T.dark }}>サポートメッセージ</div>
          <div style={{ fontSize:11, color:T.warmGray, marginTop:4 }}>ユーザー問い合わせ対応 →</div>
        </button>
      </div>
    </div>
  );
};

// ── Listings Review Page ──────────────────────────────────────────────────
const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) { setError(err.message); setLoading(false); return; }

    // 出品者情報を別途取得
    const sellerIds = [...new Set((data || []).map(l => l.seller_id))];
    const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", sellerIds);
    const profileMap = {};
    (profiles || []).forEach(p => { profileMap[p.id] = p; });

    // auth.usersからメールアドレスを取得は権限がないため、display_nameのみ使用
    setListings((data || []).map(l => ({
      id: l.id,
      title: l.title,
      seller: profileMap[l.seller_id]?.display_name || "不明",
      sellerEmail: "",
      sellerId: l.seller_id,
      category: ({ illust:"似顔絵", clothes:"お洋服", photo:"フォト", goods:"グッズ", food:"フード", training:"しつけ" })[l.category] || l.category,
      price: l.price,
      pet: l.pet_type,
      desc: l.description,
      images: l.image_urls?.length || 0,
      imageUrls: l.image_urls || [],
      date: new Date(l.created_at).toLocaleDateString("ja-JP"),
      status: l.status,
    })));
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const filtered = listings.filter(l => filter==="all" || l.status===filter);

  const handleAction = async (id, action) => {
    const { error: err } = await supabase.from("listings").update({ status: action }).eq("id", id);
    if (err) { alert("更新に失敗しました: " + err.message); return; }
    setListings(prev => prev.map(l => l.id===id ? {...l, status:action} : l));
    setSelected(null);
  };

  const statusLabel = (s) => {
    if (s==="pending") return { text:"審査待ち", bg:T.orangePale, color:T.orange };
    if (s==="approved") return { text:"承認済み", bg:T.greenPale, color:T.green };
    if (s==="rejected") return { text:"却下", bg:T.redPale, color:T.red };
    return { text:s, bg:T.lightGray, color:T.warmGray };
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>出品審査</h1>
          <p style={{ fontSize:13, color:T.warmGray }}>新規出品の承認・却下を管理</p>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["pending","審査待ち"],["approved","承認済み"],["rejected","却下"],["all","すべて"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{
              padding:"7px 16px", border:`1.5px solid ${filter===v?T.orange:T.border}`,
              borderRadius:10, background:filter===v?T.orangePale:T.white,
              color:filter===v?T.orange:T.warmGray, fontSize:12, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit"
            }}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div style={{ background:T.redPale, color:T.red, padding:"10px 14px", borderRadius:10, fontSize:13, marginBottom:16 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign:"center", padding:"48px 20px", color:T.warmGray }}>
          <div style={{ fontSize:13 }}>読み込み中...</div>
        </div>
      ) : (
        <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:T.lightGray }}>
                {["出品名","出品者","カテゴリ","価格","申請日","ステータス","操作"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:T.warmGray, textAlign:"left", borderBottom:`1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const st = statusLabel(item.status);
                return (
                  <tr key={item.id} style={{ borderBottom:`1px solid ${T.border}`, cursor:"pointer", transition:"background 0.1s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=T.lightGray}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.dark }}>{item.title}</div>
                      <div style={{ fontSize:11, color:T.warmGray }}>画像 {item.images}枚</div>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:600, color:T.dark }}>{item.seller}</div>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:T.dark }}>{item.category}</td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:800, color:T.orange }}>¥{item.price.toLocaleString()}</td>
                    <td style={{ padding:"14px 16px", fontSize:12, color:T.warmGray }}>{item.date}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background:st.bg, color:st.color, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:8 }}>{st.text}</span>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        {item.status !== "approved" && (
                          <button onClick={()=>handleAction(item.id,"approved")} style={{
                            padding:"6px 14px", background:T.green, border:"none", borderRadius:8,
                            color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                          }}>✅ 承認</button>
                        )}
                        {item.status !== "rejected" && (
                          <button onClick={()=>handleAction(item.id,"rejected")} style={{
                            padding:"6px 14px", background:T.white, border:`1.5px solid ${T.red}`,
                            borderRadius:8, color:T.red, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                          }}>却下</button>
                        )}
                        {item.status !== "pending" && (
                          <button onClick={()=>handleAction(item.id,"pending")} style={{
                            padding:"6px 12px", background:T.white, border:`1.5px solid ${T.orange}`,
                            borderRadius:8, color:T.orange, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                          }}>↺ 審査中</button>
                        )}
                        <button onClick={()=>setSelected(item)} style={{
                          padding:"6px 10px", background:T.lightGray, border:"none", borderRadius:8,
                          color:T.warmGray, fontSize:11, cursor:"pointer", fontFamily:"inherit"
                        }}>詳細</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div style={{ textAlign:"center", padding:"48px 20px", color:T.warmGray }}>
              <div style={{ fontSize:40, marginBottom:8 }}>✨</div>
              <div style={{ fontWeight:700 }}>該当する出品がありません</div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={()=>setSelected(null)}>
          <div style={{ background:T.white, borderRadius:20, padding:"28px", maxWidth:520, width:"90%", maxHeight:"80vh", overflowY:"auto" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:900, color:T.dark }}>出品詳細</h2>
              <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:T.warmGray }}>✕</button>
            </div>
            {/* 画像プレビュー */}
            {selected.imageUrls && selected.imageUrls.length > 0 && (
              <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto" }}>
                {selected.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt="" style={{ width:100, height:100, borderRadius:10, objectFit:"cover", flexShrink:0 }}/>
                ))}
              </div>
            )}
            <div style={{ background:T.lightGray, borderRadius:14, padding:"16px", marginBottom:16 }}>
              {[["タイトル",selected.title],["出品者",selected.seller],["カテゴリ",selected.category],["対象",selected.pet==="dog"?"🐕 犬":selected.pet==="cat"?"🐈 猫":"🐾 両方"],["料金",`¥${selected.price.toLocaleString()}`],["画像枚数",`${selected.images}枚`],["申請日",selected.date]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12, color:T.warmGray }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:T.dark }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.dark, marginBottom:6 }}>説明文</div>
              <div style={{ fontSize:13, color:"#555", lineHeight:1.7, background:T.cream, borderRadius:10, padding:"12px" }}>{selected.desc}</div>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {selected.status !== "approved" && (
                <button onClick={()=>handleAction(selected.id,"approved")} style={{
                  flex:"1 1 30%", minWidth:120, padding:"13px", background:T.green, border:"none", borderRadius:12,
                  color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit"
                }}>✅ 承認する</button>
              )}
              {selected.status !== "rejected" && (
                <button onClick={()=>handleAction(selected.id,"rejected")} style={{
                  flex:"1 1 30%", minWidth:120, padding:"13px", background:T.white, border:`2px solid ${T.red}`,
                  borderRadius:12, color:T.red, fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit"
                }}>❌ 却下する</button>
              )}
              {selected.status !== "pending" && (
                <button onClick={()=>handleAction(selected.id,"pending")} style={{
                  flex:"1 1 30%", minWidth:120, padding:"13px", background:T.white, border:`2px solid ${T.orange}`,
                  borderRadius:12, color:T.orange, fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit"
                }}>↺ 審査中に戻す</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Users Page ────────────────────────────────────────────────────────────
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    // profilesテーブル全件取得
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    // 各ユーザーの出品数をカウント
    const userIds = (profiles || []).map(p => p.id);
    const { data: listings } = await supabase.from("listings").select("seller_id").in("seller_id", userIds);
    const listingCounts = {};
    (listings || []).forEach(l => { listingCounts[l.seller_id] = (listingCounts[l.seller_id] || 0) + 1; });

    setUsers((profiles || []).map(p => ({
      id: p.id,
      name: p.display_name || "未設定",
      email: "",
      role: p.role || "buyer",
      status: p.is_suspended ? "suspended" : "active",
      provider: "",
      listings: listingCounts[p.id] || 0,
      sales: 0,
      revenue: 0,
      joined: new Date(p.created_at).toLocaleDateString("ja-JP"),
    })));
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => {
    if (roleFilter!=="all" && u.role!==roleFilter) return false;
    if (search && !u.name.includes(search)) return false;
    return true;
  });

  const toggleStatus = async (id) => {
    const user = users.find(u => u.id===id);
    const newSuspended = user.status === "active";
    const { error } = await supabase.from("profiles").update({ is_suspended: newSuspended }).eq("id", id);
    if (error) { alert("更新に失敗しました: " + error.message); return; }
    setUsers(prev => prev.map(u => u.id===id ? {...u, status: newSuspended ? "suspended" : "active"} : u));
  };

  const roleLabel = (r) => r==="admin"?"管理者":r==="seller"?"出品者":"購入者";
  const roleColor = (r) => r==="admin"?{bg:"#F3E5F5",color:T.purple}:r==="seller"?{bg:T.orangePale,color:T.orange}:{bg:T.bluePale,color:T.blue};

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>ユーザー管理</h1>
        <p style={{ fontSize:13, color:T.warmGray }}>登録ユーザーの管理・停止・確認</p>
      </div>

      <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, maxWidth:320 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="名前で検索..."
            style={{ width:"100%", padding:"10px 12px 10px 36px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["all","すべて"],["admin","管理者"],["seller","出品者"],["buyer","購入者"]].map(([v,l])=>(
            <button key={v} onClick={()=>setRoleFilter(v)} style={{
              padding:"8px 16px", border:`1.5px solid ${roleFilter===v?T.orange:T.border}`,
              borderRadius:10, background:roleFilter===v?T.orangePale:T.white,
              color:roleFilter===v?T.orange:T.warmGray, fontSize:12, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit"
            }}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"48px 20px", color:T.warmGray }}>読み込み中...</div>
      ) : (
      <div style={{ background:T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.lightGray }}>
              {["ユーザー","ロール","出品数","登録日","ステータス","操作"].map(h=>(
                <th key={h} style={{ padding:"12px 14px", fontSize:11, fontWeight:700, color:T.warmGray, textAlign:"left", borderBottom:`1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const rc = roleColor(u.role);
              return (
              <tr key={u.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{
                      width:34, height:34, borderRadius:"50%",
                      background:u.status==="active"?T.orangePale:T.redPale,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:14, fontWeight:800, color:u.status==="active"?T.orange:T.red
                    }}>{u.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.dark }}>{u.name}</div>
                      <div style={{ fontSize:10, color:T.warmGray }}>{u.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <span style={{
                    background:rc.bg, color:rc.color,
                    fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:8
                  }}>{roleLabel(u.role)}</span>
                </td>
                <td style={{ padding:"12px 14px", fontSize:13, color:T.dark }}>{u.listings}</td>
                <td style={{ padding:"12px 14px", fontSize:12, color:T.warmGray }}>{u.joined}</td>
                <td style={{ padding:"12px 14px" }}>
                  <span style={{
                    background:u.status==="active"?T.greenPale:T.redPale,
                    color:u.status==="active"?T.green:T.red,
                    fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:8
                  }}>{u.status==="active"?"アクティブ":"停止中"}</span>
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <button onClick={()=>toggleStatus(u.id)} style={{
                    padding:"6px 12px", border:`1.5px solid ${u.status==="active"?T.red:T.green}`,
                    borderRadius:8, background:T.white, cursor:"pointer", fontFamily:"inherit",
                    color:u.status==="active"?T.red:T.green, fontSize:11, fontWeight:700
                  }}>{u.status==="active"?"停止":"復帰"}</button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"48px 20px", color:T.warmGray }}>
            <div style={{ fontSize:40, marginBottom:8 }}>👥</div>
            <div style={{ fontWeight:700 }}>該当するユーザーがいません</div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

// ── Reports Page ──────────────────────────────────────────────────────────
const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
    // 通報者の名前を取得
    const reporterIds = [...new Set((data || []).map(r => r.reporter_id).filter(Boolean))];
    const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", reporterIds);
    const profileMap = {};
    (profiles || []).forEach(p => { profileMap[p.id] = p; });

    setReports((data || []).map(r => ({
      id: r.id,
      type: r.report_type || "通報",
      target: r.target_type === "listing" ? `出品 #${r.target_id?.slice(0,8)}` : r.target_type === "user" ? `ユーザー #${r.target_id?.slice(0,8)}` : `対象 #${r.target_id?.slice(0,8)}`,
      reporter: profileMap[r.reporter_id]?.display_name || "匿名",
      severity: r.severity || "medium",
      status: r.status || "new",
      desc: r.description || "",
      date: new Date(r.created_at).toLocaleDateString("ja-JP"),
    })));
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, []);

  const filtered = reports.filter(r => filter==="all" || r.status===filter);

  const handleStatus = async (id, status) => {
    const { error } = await supabase.from("reports").update({ status }).eq("id", id);
    if (error) { alert("更新に失敗しました: " + error.message); return; }
    setReports(prev => prev.map(r => r.id===id ? {...r, status} : r));
  };

  const severityStyle = (s) => {
    if (s==="high") return { bg:"#FFEBEE", color:T.red, label:"🔴 重大" };
    if (s==="medium") return { bg:T.orangePale, color:T.orange, label:"🟡 中" };
    return { bg:T.lightGray, color:T.warmGray, label:"🟢 軽微" };
  };

  const statusStyle = (s) => {
    if (s==="new") return { bg:T.redPale, color:T.red, label:"新規" };
    if (s==="investigating") return { bg:T.orangePale, color:T.orange, label:"調査中" };
    return { bg:T.greenPale, color:T.green, label:"対応済み" };
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>通報管理</h1>
          <p style={{ fontSize:13, color:T.warmGray }}>ユーザーからの通報を確認・対応</p>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["all","すべて"],["new","新規"],["investigating","調査中"],["resolved","対応済み"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{
              padding:"7px 16px", border:`1.5px solid ${filter===v?T.orange:T.border}`,
              borderRadius:10, background:filter===v?T.orangePale:T.white,
              color:filter===v?T.orange:T.warmGray, fontSize:12, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit"
            }}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"48px 20px", color:T.warmGray }}>読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background:T.white, borderRadius:16, padding:"48px 20px", border:`1px solid ${T.border}`, textAlign:"center", color:T.warmGray }}>
          <div style={{ fontSize:40, marginBottom:8 }}>✨</div>
          <div style={{ fontWeight:700 }}>通報はありません</div>
        </div>
      ) : (
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(r => {
          const sev = severityStyle(r.severity);
          const sts = statusStyle(r.status);
          return (
            <div key={r.id} style={{
              background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}`,
              borderLeft:`4px solid ${sev.color}`
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:15, fontWeight:800, color:T.dark }}>{r.type}</span>
                    <span style={{ background:sev.bg, color:sev.color, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>{sev.label}</span>
                    <span style={{ background:sts.bg, color:sts.color, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>{sts.label}</span>
                  </div>
                  <div style={{ fontSize:13, color:T.dark, fontWeight:700 }}>対象：{r.target}</div>
                </div>
                <div style={{ fontSize:11, color:T.warmGray, textAlign:"right" }}>
                  <div>{r.date}</div>
                  <div>通報者：{r.reporter}</div>
                </div>
              </div>
              {r.desc && (
                <div style={{ fontSize:13, color:"#555", lineHeight:1.7, background:T.cream, borderRadius:10, padding:"12px", marginBottom:12 }}>
                  {r.desc}
                </div>
              )}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {r.status !== "new" && (
                  <button onClick={()=>handleStatus(r.id,"new")} style={{
                    padding:"8px 16px", background:T.white, border:`1.5px solid ${T.red}`, borderRadius:8,
                    color:T.red, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>↺ 新規に戻す</button>
                )}
                {r.status !== "investigating" && (
                  <button onClick={()=>handleStatus(r.id,"investigating")} style={{
                    padding:"8px 16px", background:T.orange, border:"none", borderRadius:8,
                    color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>🔍 調査中にする</button>
                )}
                {r.status !== "resolved" && (
                  <button onClick={()=>handleStatus(r.id,"resolved")} style={{
                    padding:"8px 16px", background:T.green, border:"none", borderRadius:8,
                    color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>✅ 対応完了</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

// ── Events Review Page ────────────────────────────────────────────────────
const EventsReviewPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    const organizerIds = [...new Set((data || []).map(e => e.organizer_id).filter(Boolean))];
    const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", organizerIds);
    const profileMap = {};
    (profiles || []).forEach(p => { profileMap[p.id] = p; });

    setEvents((data || []).map(e => ({
      id: e.id,
      title: e.title,
      organizer: profileMap[e.organizer_id]?.display_name || "不明",
      date: e.event_date || "",
      place: e.location || "",
      fee: e.fee || "無料",
      pet: e.pet_type || "both",
      desc: e.description || "",
      status: e.status || "pending",
      submitted: new Date(e.created_at).toLocaleDateString("ja-JP"),
    })));
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const filtered = events.filter(e => filter==="all" || e.status===filter);

  const handleAction = async (id, action) => {
    const { error } = await supabase.from("events").update({ status: action }).eq("id", id);
    if (error) { alert("更新に失敗しました: " + error.message); return; }
    setEvents(prev => prev.map(e => e.id===id ? {...e, status:action} : e));
  };

  const petLabel = (p) => p==="dog"?"🐕 犬":p==="cat"?"🐈 猫":"🐾 両方";

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>イベント審査</h1>
          <p style={{ fontSize:13, color:T.warmGray }}>投稿されたイベントの承認・却下</p>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["pending","審査待ち"],["approved","承認済み"],["rejected","却下"],["all","すべて"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{
              padding:"7px 16px", border:`1.5px solid ${filter===v?T.orange:T.border}`,
              borderRadius:10, background:filter===v?T.orangePale:T.white,
              color:filter===v?T.orange:T.warmGray, fontSize:12, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit"
            }}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"48px 20px", color:T.warmGray }}>読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background:T.white, borderRadius:16, padding:"48px 20px", border:`1px solid ${T.border}`, textAlign:"center", color:T.warmGray }}>
          <div style={{ fontSize:40, marginBottom:8 }}>📅</div>
          <div style={{ fontWeight:700 }}>イベントはありません</div>
        </div>
      ) : (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {filtered.map(ev => (
          <div key={ev.id} style={{
            background:T.white, borderRadius:16, padding:"24px", border:`1px solid ${T.border}`
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                  <span style={{ fontSize:20 }}>📅</span>
                  <span style={{ fontSize:18, fontWeight:900, color:T.dark }}>{ev.title}</span>
                  {ev.status==="pending" && <span style={{ background:T.orangePale, color:T.orange, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:8 }}>審査待ち</span>}
                  {ev.status==="approved" && <span style={{ background:T.greenPale, color:T.green, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:8 }}>承認済み</span>}
                  {ev.status==="rejected" && <span style={{ background:T.redPale, color:T.red, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:8 }}>却下</span>}
                </div>
                <div style={{ fontSize:12, color:T.warmGray }}>投稿日：{ev.submitted}</div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
              {[["📅 開催日",ev.date],["📍 場所",ev.place],["💰 参加費",ev.fee],["👤 主催者",ev.organizer],["🐾 対象",petLabel(ev.pet)]].map(([k,v])=>(
                <div key={k} style={{ background:T.lightGray, borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:T.warmGray, marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.dark }}>{v || "-"}</div>
                </div>
              ))}
            </div>

            {ev.desc && (
              <div style={{ fontSize:13, color:"#555", lineHeight:1.7, background:T.cream, borderRadius:10, padding:"12px", marginBottom:16 }}>
                {ev.desc}
              </div>
            )}

            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {ev.status !== "approved" && (
                <button onClick={()=>handleAction(ev.id,"approved")} style={{
                  padding:"10px 24px", background:T.green, border:"none", borderRadius:10,
                  color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit"
                }}>✅ 承認する</button>
              )}
              {ev.status !== "rejected" && (
                <button onClick={()=>handleAction(ev.id,"rejected")} style={{
                  padding:"10px 24px", background:T.white, border:`2px solid ${T.red}`,
                  borderRadius:10, color:T.red, fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit"
                }}>❌ 却下する</button>
              )}
              {ev.status !== "pending" && (
                <button onClick={()=>handleAction(ev.id,"pending")} style={{
                  padding:"10px 24px", background:T.white, border:`2px solid ${T.orange}`,
                  borderRadius:10, color:T.orange, fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit"
                }}>↺ 審査中に戻す</button>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// ── Revenue Page ──────────────────────────────────────────────────────────
const RevenuePage = () => {
  const totalRevenue = MONTHLY_REVENUE.reduce((s,m)=>s+m.revenue,0);
  const totalOrders = MONTHLY_REVENUE.reduce((s,m)=>s+m.orders,0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const commission = Math.round(totalRevenue * 0.086); // 平均手数料率

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>売上分析</h1>
        <p style={{ fontSize:13, color:T.warmGray }}>Qoccaの売上・手数料収益を分析</p>
      </div>

      <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
        <StatCard icon="💰" label="年間GMV" value={`¥${totalRevenue.toLocaleString()}`} sub="総取引金額" color={T.orange}/>
        <StatCard icon="🏦" label="手数料収益" value={`¥${commission.toLocaleString()}`} sub="推定年間収益" bg={T.greenPale} color={T.green}/>
        <StatCard icon="🛒" label="平均注文単価" value={`¥${avgOrderValue.toLocaleString()}`} bg={T.bluePale}/>
        <StatCard icon="📊" label="年間取引数" value={`${totalOrders}件`} bg={T.purplePale}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
        <div style={{ background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:16 }}>💰 月間売上推移（GMV）</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:T.warmGray }}/>
              <YAxis tick={{ fontSize:11, fill:T.warmGray }} tickFormatter={v=>`¥${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v)=>[`¥${v.toLocaleString()}`,"売上"]} contentStyle={{ borderRadius:10, border:`1px solid ${T.border}`, fontSize:12 }}/>
              <Bar dataKey="revenue" fill={T.orange} radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:16 }}>📈 ユーザー成長</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:T.warmGray }}/>
              <YAxis tick={{ fontSize:11, fill:T.warmGray }}/>
              <Tooltip contentStyle={{ borderRadius:10, border:`1px solid ${T.border}`, fontSize:12 }}/>
              <Line type="monotone" dataKey="users" stroke={T.blue} strokeWidth={2.5} dot={{ r:4 }}/>
              <Line type="monotone" dataKey="orders" stroke={T.orange} strokeWidth={2.5} dot={{ r:4 }}/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:12, height:3, background:T.blue, borderRadius:2 }}/><span style={{ fontSize:11, color:T.warmGray }}>ユーザー数</span></div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:12, height:3, background:T.orange, borderRadius:2 }}/><span style={{ fontSize:11, color:T.warmGray }}>取引数</span></div>
          </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div style={{ background:T.white, borderRadius:16, padding:"20px", border:`1px solid ${T.border}` }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:16 }}>🏦 手数料シミュレーション</div>
        <div style={{ background:T.orangePale, borderRadius:12, padding:"14px", marginBottom:16, fontSize:12, color:T.orange, lineHeight:1.7, fontWeight:600 }}>
          手数料体系：初回取引 0% → 登録〜3ヶ月 5% → 通常 10%（＋Stripe決済手数料3.6%）※すべて出品者売上から控除。購入者は表示価格のみ支払い。
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:T.lightGray }}>
              {["月","GMV","推定手数料","Stripe手数料","Qocca収益"].map(h=>(
                <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:T.warmGray, textAlign:"left", borderBottom:`1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MONTHLY_REVENUE.map((m,i)=>{
              const rate = i < 1 ? 0 : i < 4 ? 0.05 : 0.10;
              const qoccaFee = Math.round(m.revenue * rate);
              const stripeFee = Math.round(m.revenue * 0.036);
              return (
                <tr key={m.month} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:T.dark }}>{m.month}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, color:T.dark }}>¥{m.revenue.toLocaleString()}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, color:T.orange, fontWeight:700 }}>¥{qoccaFee.toLocaleString()} ({(rate*100).toFixed(0)}%)</td>
                  <td style={{ padding:"10px 14px", fontSize:13, color:T.warmGray }}>¥{stripeFee.toLocaleString()}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:800, color:T.green }}>¥{qoccaFee.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Refunds / Trouble Page ─────────────────────────────────────────────────
const RefundsPage = () => {
  const [cases, setCases] = useState(REFUND_CASES);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = cases.filter(c => filter==="all" || c.status===filter);

  const handleAction = (id, action) => {
    setCases(prev => prev.map(c => c.id===id ? {
      ...c,
      status: action,
      escrow: action==="refunded"?"released_buyer":action==="rejected"?"released_seller":c.escrow,
      timeline: [...c.timeline, {
        date: new Date().toLocaleDateString("ja-JP").replace(/\//g,"."),
        action: action==="refunded"?"全額返金を実行":action==="rejected"?"返金申請を却下":"調査を開始",
        by:"admin"
      }]
    } : c));
  };

  const statusStyle = (s) => {
    if (s==="new") return { bg:T.redPale, color:T.red, label:"新規申請" };
    if (s==="investigating") return { bg:T.orangePale, color:T.orange, label:"調査中" };
    if (s==="refunded") return { bg:T.greenPale, color:T.green, label:"返金済み" };
    if (s==="rejected") return { bg:T.lightGray, color:T.warmGray, label:"却下" };
    return { bg:T.lightGray, color:T.warmGray, label:s };
  };

  const escrowStyle = (e) => {
    if (e==="held") return { bg:T.orangePale, color:T.orange, label:"🔒 保留中" };
    if (e==="released_buyer") return { bg:T.greenPale, color:T.green, label:"💸 購入者へ返金" };
    if (e==="released_seller") return { bg:T.bluePale, color:T.blue, label:"✅ 出品者へ支払い" };
    return { bg:T.lightGray, color:T.warmGray, label:e };
  };

  const totalHeld = cases.filter(c=>c.escrow==="held").reduce((s,c)=>s+c.amount,0);
  const totalRefunded = cases.filter(c=>c.status==="refunded").reduce((s,c)=>s+c.amount,0);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>返金・トラブル管理</h1>
        <p style={{ fontSize:13, color:T.warmGray }}>返金申請の対応・エスクロー管理</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display:"flex", gap:14, marginBottom:24 }}>
        <div style={{ flex:1, background:T.white, borderRadius:14, padding:"16px 18px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, color:T.warmGray, fontWeight:600, marginBottom:4 }}>🔒 エスクロー保留中</div>
          <div style={{ fontSize:22, fontWeight:900, color:T.orange }}>¥{totalHeld.toLocaleString()}</div>
          <div style={{ fontSize:11, color:T.warmGray, marginTop:2 }}>{cases.filter(c=>c.escrow==="held").length}件</div>
        </div>
        <div style={{ flex:1, background:T.white, borderRadius:14, padding:"16px 18px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, color:T.warmGray, fontWeight:600, marginBottom:4 }}>💸 返金済み累計</div>
          <div style={{ fontSize:22, fontWeight:900, color:T.red }}>¥{totalRefunded.toLocaleString()}</div>
          <div style={{ fontSize:11, color:T.warmGray, marginTop:2 }}>{cases.filter(c=>c.status==="refunded").length}件</div>
        </div>
        <div style={{ flex:1, background:T.white, borderRadius:14, padding:"16px 18px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, color:T.warmGray, fontWeight:600, marginBottom:4 }}>⏳ 対応待ち</div>
          <div style={{ fontSize:22, fontWeight:900, color:T.orangeDeep }}>{cases.filter(c=>c.status==="new"||c.status==="investigating").length}件</div>
        </div>
        <div style={{ flex:1, background:T.white, borderRadius:14, padding:"16px 18px", border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, color:T.warmGray, fontWeight:600, marginBottom:4 }}>❌ 却下済み</div>
          <div style={{ fontSize:22, fontWeight:900, color:T.warmGray }}>{cases.filter(c=>c.status==="rejected").length}件</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {[["all","すべて"],["new","新規"],["investigating","調査中"],["refunded","返金済み"],["rejected","却下"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{
            padding:"7px 16px", border:`1.5px solid ${filter===v?T.orange:T.border}`,
            borderRadius:10, background:filter===v?T.orangePale:T.white,
            color:filter===v?T.orange:T.warmGray, fontSize:12, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit"
          }}>{l}</button>
        ))}
      </div>

      {/* Cases List */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(c => {
          const st = statusStyle(c.status);
          const esc = escrowStyle(c.escrow);
          return (
            <div key={c.id} style={{
              background:T.white, borderRadius:16, border:`1px solid ${T.border}`,
              borderLeft:`4px solid ${st.color}`, overflow:"hidden"
            }}>
              <div style={{ padding:"20px", cursor:"pointer" }} onClick={()=>setSelected(selected?.id===c.id?null:c)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontSize:11, color:T.warmGray, fontWeight:600, background:T.lightGray, padding:"2px 8px", borderRadius:6 }}>{c.orderId}</span>
                      <span style={{ background:st.bg, color:st.color, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>{st.label}</span>
                      <span style={{ background:esc.bg, color:esc.color, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>{esc.label}</span>
                    </div>
                    <div style={{ fontSize:16, fontWeight:800, color:T.dark, marginBottom:4 }}>{c.item}</div>
                    <div style={{ fontSize:12, color:T.warmGray }}>購入者：{c.buyer} → 出品者：{c.seller}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:20, fontWeight:900, color:T.orange }}>¥{c.amount.toLocaleString()}</div>
                    <div style={{ fontSize:11, color:T.warmGray }}>{c.date}</div>
                  </div>
                </div>
                <div style={{ fontSize:13, color:"#555", background:T.cream, borderRadius:10, padding:"10px 12px" }}>
                  <span style={{ fontWeight:700, color:T.dark }}>理由：</span>{c.reason}
                </div>
              </div>

              {/* Expanded Detail */}
              {selected?.id===c.id && (
                <div style={{ borderTop:`1px solid ${T.border}`, padding:"20px", background:T.lightGray }}>
                  {/* Timeline */}
                  <div style={{ fontSize:13, fontWeight:800, color:T.dark, marginBottom:12 }}>📋 対応タイムライン</div>
                  <div style={{ marginBottom:20 }}>
                    {c.timeline.map((t,i) => (
                      <div key={i} style={{ display:"flex", gap:12, marginBottom:i<c.timeline.length-1?12:0, position:"relative" }}>
                        {i<c.timeline.length-1 && <div style={{ position:"absolute", left:7, top:18, width:2, height:"calc(100% + 4px)", background:T.border }}/>}
                        <div style={{
                          width:16, height:16, borderRadius:"50%", flexShrink:0, marginTop:2,
                          background:t.by==="admin"?T.orange:t.by==="system"?T.blue:T.warmGray,
                          border:`2px solid ${T.white}`
                        }}/>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:T.dark }}>{t.action}</div>
                          <div style={{ fontSize:10, color:T.warmGray }}>{t.date} · {t.by}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                    <div style={{ background:T.white, borderRadius:10, padding:"12px" }}>
                      <div style={{ fontSize:10, color:T.warmGray, marginBottom:4 }}>👤 購入者</div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.dark }}>{c.buyer}</div>
                      <div style={{ fontSize:11, color:T.warmGray }}>{c.buyerEmail}</div>
                    </div>
                    <div style={{ background:T.white, borderRadius:10, padding:"12px" }}>
                      <div style={{ fontSize:10, color:T.warmGray, marginBottom:4 }}>🎨 出品者</div>
                      <div style={{ fontSize:13, fontWeight:700, color:T.dark }}>{c.seller}</div>
                      <div style={{ fontSize:11, color:T.warmGray }}>{c.sellerEmail}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(c.status==="new" || c.status==="investigating") && (
                    <div style={{ display:"flex", gap:10 }}>
                      {c.status==="new" && (
                        <button onClick={()=>handleAction(c.id,"investigating")} style={{
                          padding:"10px 20px", background:T.orange, border:"none", borderRadius:10,
                          color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit"
                        }}>🔍 調査開始</button>
                      )}
                      <button onClick={()=>handleAction(c.id,"refunded")} style={{
                        padding:"10px 20px", background:T.green, border:"none", borderRadius:10,
                        color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit"
                      }}>💸 全額返金</button>
                      <button onClick={()=>handleAction(c.id,"rejected")} style={{
                        padding:"10px 20px", background:T.white, border:`2px solid ${T.red}`, borderRadius:10,
                        color:T.red, fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit"
                      }}>❌ 返金却下</button>
                      <button style={{
                        padding:"10px 20px", background:T.white, border:`1.5px solid ${T.border}`, borderRadius:10,
                        color:T.warmGray, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit"
                      }}>✉️ 両者に連絡</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Support / Messages Page ───────────────────────────────────────────────
const SupportPage = () => {
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("all");
  const [showTemplates, setShowTemplates] = useState(false);

  const filtered = tickets.filter(t => filter==="all" || t.status===filter);

  const priorityStyle = (p) => {
    if (p==="high") return { bg:T.redPale, color:T.red, label:"🔴 高" };
    if (p==="medium") return { bg:T.orangePale, color:T.orange, label:"🟡 中" };
    return { bg:T.lightGray, color:T.warmGray, label:"🟢 低" };
  };

  const categoryIcon = (c) => {
    const map = { "返金":"💰", "出品":"📦", "技術":"🔧", "注文":"🛒", "通報":"🚨" };
    return map[c] || "💬";
  };

  const sendReply = (ticketId) => {
    if (!reply.trim()) return;
    setTickets(prev => prev.map(t => t.id===ticketId ? {
      ...t,
      messages: [...t.messages, {
        from:"admin", name:"サポート",
        text: reply,
        time: new Date().toLocaleString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).replace(/\//g,".")
      }]
    } : t));
    setReply("");
    setShowTemplates(false);
  };

  const resolveTicket = (ticketId) => {
    setTickets(prev => prev.map(t => t.id===ticketId ? {...t, status:"resolved"} : t));
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:T.dark, marginBottom:4 }}>サポートメッセージ</h1>
        <p style={{ fontSize:13, color:T.warmGray }}>ユーザーからの問い合わせに対応</p>
      </div>

      <div style={{ display:"flex", gap:20, height:"calc(100vh - 160px)" }}>
        {/* Ticket List */}
        <div style={{ width:360, flexShrink:0, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", gap:6, marginBottom:12 }}>
            {[["all","すべて"],["open","未解決"],["resolved","解決済み"]].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)} style={{
                padding:"6px 14px", border:`1.5px solid ${filter===v?T.orange:T.border}`,
                borderRadius:8, background:filter===v?T.orangePale:T.white,
                color:filter===v?T.orange:T.warmGray, fontSize:11, fontWeight:700,
                cursor:"pointer", fontFamily:"inherit"
              }}>{l}</button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
            {filtered.map(t => {
              const pri = priorityStyle(t.priority);
              const isSelected = selected?.id===t.id;
              const lastMsg = t.messages[t.messages.length-1];
              return (
                <button key={t.id} onClick={()=>setSelected(t)} style={{
                  background:isSelected?T.orangePale:T.white, borderRadius:14,
                  padding:"14px", border:`1.5px solid ${isSelected?T.orange:T.border}`,
                  cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                  transition:"all 0.15s"
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <span style={{ fontSize:14 }}>{categoryIcon(t.category)}</span>
                      <span style={{ fontSize:13, fontWeight:800, color:T.dark }}>{t.user}</span>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      <span style={{ background:pri.bg, color:pri.color, fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4 }}>{pri.label}</span>
                      <span style={{
                        background:t.status==="open"?T.bluePale:T.greenPale,
                        color:t.status==="open"?T.blue:T.green,
                        fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:4
                      }}>{t.status==="open"?"未解決":"解決済み"}</span>
                    </div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.dark, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {t.subject}
                  </div>
                  <div style={{ fontSize:11, color:T.warmGray, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {lastMsg.from==="admin"?"あなた: ":""}{lastMsg.text}
                  </div>
                  <div style={{ fontSize:10, color:T.warmGray, marginTop:6 }}>{t.created}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        {selected ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", background:T.white, borderRadius:16, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            {/* Header */}
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:T.dark }}>{selected.subject}</div>
                <div style={{ fontSize:12, color:T.warmGray }}>{selected.user} · {selected.email} · {selected.category}</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {selected.status==="open" && (
                  <button onClick={()=>resolveTicket(selected.id)} style={{
                    padding:"7px 14px", background:T.green, border:"none", borderRadius:8,
                    color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>✅ 解決済みにする</button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:14 }}>
              {(tickets.find(t=>t.id===selected.id)?.messages || selected.messages).map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.from==="admin"?"flex-end":"flex-start" }}>
                  <div style={{
                    maxWidth:"70%", padding:"12px 16px", borderRadius:16,
                    background:m.from==="admin"?T.orange:"#F0EFEC",
                    color:m.from==="admin"?"#fff":T.dark,
                    borderBottomRightRadius:m.from==="admin"?4:16,
                    borderBottomLeftRadius:m.from==="admin"?16:4,
                  }}>
                    <div style={{ fontSize:11, fontWeight:700, marginBottom:4, opacity:0.7 }}>{m.name}</div>
                    <div style={{ fontSize:13, lineHeight:1.7 }}>{m.text}</div>
                    <div style={{ fontSize:10, marginTop:6, opacity:0.5, textAlign:"right" }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Area */}
            {selected.status==="open" && (
              <div style={{ borderTop:`1px solid ${T.border}`, padding:"16px 20px" }}>
                {/* Template Selector */}
                {showTemplates && (
                  <div style={{ marginBottom:12, background:T.lightGray, borderRadius:12, padding:"12px", display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.warmGray, marginBottom:4 }}>テンプレートを選択</div>
                    {REPLY_TEMPLATES.map(tpl => (
                      <button key={tpl.id} onClick={()=>{setReply(tpl.text);setShowTemplates(false);}} style={{
                        padding:"8px 12px", background:T.white, border:`1px solid ${T.border}`,
                        borderRadius:8, cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                        fontSize:12, color:T.dark, fontWeight:600, transition:"background 0.1s"
                      }}>
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setShowTemplates(!showTemplates)} style={{
                    padding:"10px 12px", background:T.lightGray, border:"none", borderRadius:10,
                    cursor:"pointer", fontSize:16, flexShrink:0
                  }} title="テンプレート">📋</button>
                  <textarea value={reply} onChange={e=>setReply(e.target.value)}
                    placeholder="返信を入力..."
                    rows={2}
                    style={{
                      flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${T.border}`,
                      fontSize:13, fontFamily:"inherit", outline:"none", resize:"none", lineHeight:1.6
                    }}
                    onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){sendReply(selected.id);}}}
                  />
                  <button onClick={()=>sendReply(selected.id)} disabled={!reply.trim()} style={{
                    padding:"10px 20px", background:reply.trim()?T.orange:T.border, border:"none",
                    borderRadius:10, color:"#fff", fontWeight:800, fontSize:13, cursor:reply.trim()?"pointer":"not-allowed",
                    fontFamily:"inherit", flexShrink:0
                  }}>送信 ↩</button>
                </div>
                <div style={{ fontSize:10, color:T.warmGray, marginTop:6 }}>Ctrl+Enter で送信</div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:T.white, borderRadius:16, border:`1px solid ${T.border}` }}>
            <div style={{ textAlign:"center", color:T.warmGray }}>
              <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
              <div style={{ fontSize:15, fontWeight:700 }}>チケットを選択してください</div>
              <div style={{ fontSize:12, marginTop:4 }}>左のリストからお問い合わせを選択</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Admin Login Page ──────────────────────────────────────────────────────
const AdminLoginPage = ({ onLogin, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setLocalError("メールアドレスまたはパスワードが違います"); return; }
    onLogin(data.user);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.cream, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Noto Sans JP',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet"/>
      <div style={{ background:T.white, borderRadius:20, padding:"40px 32px", width:"100%", maxWidth:400, border:`1px solid ${T.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🔐</div>
          <h1 style={{ fontSize:22, fontWeight:900, color:T.dark, marginBottom:6, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Qocca Admin</h1>
          <p style={{ fontSize:12, color:T.warmGray }}>管理者専用ページ</p>
        </div>
        {(error || localError) && (
          <div style={{ background:T.redPale, color:T.red, padding:"10px 14px", borderRadius:10, fontSize:12, marginBottom:16, fontWeight:700 }}>
            {localError || error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, color:T.dark, display:"block", marginBottom:6 }}>メールアドレス</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
              style={{ width:"100%", padding:"11px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:700, color:T.dark, display:"block", marginBottom:6 }}>パスワード</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
              style={{ width:"100%", padding:"11px 12px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <button type="submit" disabled={loading} style={{
            width:"100%", padding:"12px", background:loading?T.warmGray:T.orange,
            border:"none", borderRadius:10, color:T.white, fontWeight:800, fontSize:14,
            cursor:loading?"not-allowed":"pointer", fontFamily:"inherit"
          }}>{loading ? "確認中..." : "ログイン"}</button>
        </form>
        <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${T.border}`, fontSize:11, color:T.warmGray, textAlign:"center" }}>
          管理者権限が必要です
        </div>
      </div>
    </div>
  );
};

// ── Access Denied ─────────────────────────────────────────────────────────
const AccessDeniedPage = ({ onLogout }) => (
  <div style={{ minHeight:"100vh", background:T.cream, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Noto Sans JP',sans-serif" }}>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet"/>
    <div style={{ background:T.white, borderRadius:20, padding:"40px 32px", width:"100%", maxWidth:400, border:`1px solid ${T.border}`, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🚫</div>
      <h1 style={{ fontSize:20, fontWeight:900, color:T.dark, marginBottom:10 }}>アクセス拒否</h1>
      <p style={{ fontSize:13, color:T.warmGray, lineHeight:1.7, marginBottom:20 }}>
        このページは管理者のみアクセスできます。<br/>アクセス権限がありません。
      </p>
      <button onClick={onLogout} style={{
        padding:"10px 24px", background:T.white, border:`1.5px solid ${T.border}`,
        borderRadius:10, color:T.warmGray, fontWeight:700, fontSize:13, cursor:"pointer"
      }}>ログアウト</button>
    </div>
  </div>
);

// ── Main App ──────────────────────────────────────────────────────────────
export default function QoccaAdmin() {
  const [active, setActive] = useState("dashboard");
  const [authState, setAuthState] = useState({ loading: true, user: null, isAdmin: false });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setAuthState({ loading: false, user: null, isAdmin: false });
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      setAuthState({
        loading: false,
        user: session.user,
        isAdmin: profile?.role === "admin"
      });
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from("profiles").select("role").eq("id", session.user.id).single().then(({ data: profile }) => {
          setAuthState({
            loading: false,
            user: session.user,
            isAdmin: profile?.role === "admin"
          });
        });
      } else {
        setAuthState({ loading: false, user: null, isAdmin: false });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (user) => {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") {
      setAuthError("");
      setAuthState({ loading: false, user, isAdmin: false });
      return;
    }
    setAuthState({ loading: false, user, isAdmin: true });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthState({ loading: false, user: null, isAdmin: false });
    setAuthError("");
  };

  // ローディング中
  if (authState.loading) {
    return (
      <div style={{ minHeight:"100vh", background:T.cream, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Noto Sans JP',sans-serif" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:24, fontWeight:900, color:T.orange, fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>Qocca Admin</div>
          <div style={{ marginTop:12, fontSize:12, color:T.warmGray }}>読み込み中...</div>
        </div>
      </div>
    );
  }

  // 未ログイン
  if (!authState.user) {
    return <AdminLoginPage onLogin={handleLogin} error={authError}/>;
  }

  // ログイン済みだがadminじゃない
  if (!authState.isAdmin) {
    return <AccessDeniedPage onLogout={handleLogout}/>;
  }

  // 管理者としてログイン済み
  return (
    <div style={{ fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif", background:T.cream, minHeight:"100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet"/>
      <Sidebar active={active} setActive={setActive}/>
      <div style={{ marginLeft:240, padding:"32px 40px", minHeight:"100vh" }}>
        {/* Top Bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div style={{ fontSize:12, color:T.warmGray }}>
            {new Date().toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"})}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:12, color:T.warmGray }}>👤 {authState.user.email}</span>
            <a href="https://qocca.vercel.app" target="_blank" rel="noopener noreferrer" style={{
              padding:"7px 14px", background:T.white, border:`1.5px solid ${T.border}`,
              borderRadius:8, fontSize:12, fontWeight:700, color:T.warmGray,
              textDecoration:"none", cursor:"pointer"
            }}>🌐 サイトを開く</a>
            <button onClick={handleLogout} style={{
              padding:"7px 14px", background:T.white, border:`1.5px solid ${T.border}`,
              borderRadius:8, fontSize:12, fontWeight:700, color:T.warmGray,
              cursor:"pointer", fontFamily:"inherit"
            }}>ログアウト</button>
          </div>
        </div>

        {active==="dashboard" && <DashboardPage setActive={setActive}/>}
        {active==="listings" && <ListingsPage/>}
        {active==="users" && <UsersPage/>}
        {active==="reports" && <ReportsPage/>}
        {active==="events" && <EventsReviewPage/>}
        {active==="revenue" && <RevenuePage/>}
        {active==="refunds" && <RefundsPage/>}
        {active==="support" && <SupportPage/>}
      </div>
      <style>{`
        html, body { margin:0; padding:0; }
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        input:focus,textarea:focus{border-color:${T.orange}!important;outline:none}
        table tr:hover td{background:${T.lightGray}}
      `}</style>
    </div>
  );
}
