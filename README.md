# 🎰 뽑았다! — 갓챠 자랑 게시판 · 프론트엔드

가챠에서 뽑은 캐릭터를 사진과 함께 자랑하고, 작품·시리즈별로 구경하는 게시판의 **화면**이에요.
Next.js로 만들었고, API 서버(백엔드)는 [gacha-showoff-level1-backend](https://github.com/raramen98/gacha-showoff-level1-backend) 저장소에 있어요.

- 기획서: [기획서.md](./기획서.md)

> ⏰ 백엔드가 Render **무료 서버**라서, 한동안 아무도 안 쓰다가 처음 열면 1분 가까이 걸리거나
> "데이터를 불러오지 못했어요" 화면이 나올 수 있어요. 잠시 뒤 **다시 시도**를 눌러 주세요.

## 화면
| 화면 | 주소 | 하는 일 |
|---|---|---|
| 자랑 목록 (홈) | `/` | 최근 자랑 글을 카드로 보기, 작품·레어도로 골라 보기 |
| 자랑 상세 | `/posts/[id]` | 사진, 작품, 시리즈, 캐릭터, 레어도, 한마디, 닉네임, 업로드 날짜 |
| 자랑 등록 | `/posts/new` | 사진(필수, 미리 보기) + 글 쓰기, 시리즈는 선택 |
| 시리즈 목록 | `/series` | 작품별 시리즈 보기 + 새 시리즈 등록 |
| 시리즈 상세 | `/series/[id]` | 레어도 비율 + 이 시리즈로 올라온 자랑 글 |

- 입력이 틀리면 칸 바로 아래에 쉬운 한국어로 이유를 보여 줘요. 백엔드에서도 같은 규칙으로 한 번 더 확인해요.
- 사진이 없는 가상 데이터는 작품별 색과 이모지로 꾸며요. (🎀 산리오, ⚡ 포켓몬, 🌀 주술회전, 🍥 나루토, 🗡️ 진격의 거인, 🏰 디즈니)

## 기술
- Next.js 15 (App Router), React 19, TypeScript
- 별도 UI 라이브러리 없이 CSS 한 파일(`app/globals.css`)

## 내 컴퓨터에서 실행하기
백엔드를 먼저 켜 두세요.
```bash
npm install
cp .env.example .env.local   # 백엔드 주소 적기 (기본: http://localhost:4000)
npm run dev                  # http://localhost:3000
```

## 설정값
| 이름 | 뜻 | 예 |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | 백엔드(API 서버) 주소. 끝에 `/` 없이 | `https://gacha-showoff-level1-backend.onrender.com` |

> `.env.local`은 `.gitignore`에 들어 있어서 GitHub에 올라가지 않아요.

## Vercel에 올리기
1. Vercel → **Add New → Project** → 이 저장소 선택 (Framework: Next.js는 자동으로 잡혀요)
2. **Environment Variables**에 `NEXT_PUBLIC_API_URL` = 백엔드 Render 주소를 넣고 **Deploy**
   - `NEXT_PUBLIC_`으로 시작하는 값은 빌드할 때 들어가요. 나중에 바꾸면 **Redeploy**를 해야 적용돼요.
3. 배포된 Vercel 주소를 백엔드(Render)의 `CORS_ORIGIN`에 넣어 주세요. 그래야 등록 화면에서 글을 올릴 수 있어요.
