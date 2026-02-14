// 샘플 데이터를 Supabase에 삽입하고, 결과를 조회하는 스크립트
// 실행: npx ts-node src/scripts/insertSampleData.ts
import { supabaseAdmin } from "../config/supabase";

async function insertSampleData() {
  // 1. users 테이블에 샘플 데이터 삽입
  // uuid 생성 함수
  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  // users 테이블에 샘플 데이터 삽입 (uuid, name, email)
  const user1 = { id: uuidv4(), name: "홍길동", email: "hong@test.com" };
  const user2 = { id: uuidv4(), name: "김철수", email: "kim@test.com" };
  const users = [user1, user2];
  const { error: userError } = await supabaseAdmin.from("users").insert(users);
  if (userError) {
    console.error("users insert error:", userError.message);
  } else {
    console.log("users 샘플 데이터 삽입 완료");
  }

  // 2. auctions 테이블에 샘플 데이터 삽입 (컬럼명 및 타입에 맞게 수정)
  // auctions 테이블에 샘플 데이터 삽입 (uuid, seller_id는 users의 id)
  const auctions = [
    {
      title: "골동품 시계",
      description: "100년 된 골동품 시계입니다.",
      starting_price: 10000,
      current_price: 10000,
      seller_id: user1.id,
      status: "active" as const,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      title: "한정판 피규어",
      description: "희귀 한정판 피규어 경매",
      starting_price: 50000,
      current_price: 50000,
      seller_id: user2.id,
      status: "active" as const,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 172800000).toISOString(),
    },
  ];
  const { error: auctionError } = await supabaseAdmin
    .from("auctions")
    .insert(auctions);
  if (auctionError) {
    console.error("auctions insert error:", auctionError.message);
  } else {
    console.log("auctions 샘플 데이터 삽입 완료");
  }

  // 3. bids 테이블에 샘플 데이터 삽입 (컬럼명 및 타입에 맞게 수정)
  // auctions의 id를 조회해서 bids에 사용
  // auctions의 id를 조회해서 bids에 사용
  const auctionsIdResult = await supabaseAdmin
    .from("auctions")
    .select("id")
    .order("created_at", { ascending: true });
  const auctionList = auctionsIdResult.data || [];
  if (auctionList.length < 1) {
    console.error(
      "경매 데이터가 충분하지 않습니다. bids 샘플 데이터 삽입 생략",
    );
  } else {
    const bids = [
      {
        auction_id: auctionList[0].id,
        bidder_id: user2.id,
        amount: 12000,
        created_at: new Date().toISOString(),
      },
      {
        auction_id: auctionList[0].id,
        bidder_id: user1.id,
        amount: 15000,
        created_at: new Date().toISOString(),
      },
    ];
    const { error: bidError } = await supabaseAdmin.from("bids").insert(bids);
    if (bidError) {
      console.error("bids insert error:", bidError.message);
    } else {
      console.log("bids 샘플 데이터 삽입 완료");
    }
  }

  // 4. 전체 데이터 조회
  const usersResult = await supabaseAdmin.from("users").select("*");
  const auctionsResult = await supabaseAdmin.from("auctions").select("*");
  const bidsResult = await supabaseAdmin.from("bids").select("*");
  console.log("\n=== users ===");
  console.log(
    usersResult.error
      ? usersResult.error.message
      : JSON.stringify(usersResult.data, null, 2),
  );
  console.log("\n=== auctions ===");
  console.log(
    auctionsResult.error
      ? auctionsResult.error.message
      : JSON.stringify(auctionsResult.data, null, 2),
  );
  console.log("\n=== bids ===");
  console.log(
    bidsResult.error
      ? bidsResult.error.message
      : JSON.stringify(bidsResult.data, null, 2),
  );
}

insertSampleData().catch(console.error);
