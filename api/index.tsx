import { Button, Frog } from 'frog'
import { handle } from 'frog/vercel'

// Uncomment this packages to tested on local server
// import { devtools } from 'frog/dev';
// import { serveStatic } from 'frog/serve-static';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api/frame',
  imageOptions: {
    /* Other default options */
    fonts: [
      {
        name: 'Space Mono',
        source: 'google',
      },
    ],    
  },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', (c) => {
  return c.res({
    image: (
        <div
            style={{
                alignItems: 'center',
                background: 'radial-gradient(to right, #432889, #17101F)',
                backgroundSize: '100% 100%',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                height: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
                color: 'white',
                fontFamily: 'Space Mono',
                fontSize: 35,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                lineHeight: 1.4,
                marginTop: 0,
                padding: '0 120px',
                whiteSpace: 'pre-wrap',
            }}
        >
            <p>Hi Degeners! 🎩</p>
            Let's check if you are qualified for the $DEGEN Airdrop 3.
        </div>
    ),
    intents: [
        <Button action='/check'>⌁ Check</Button>,
        <Button.Link href='https://warpcast.com/0x94t3z'>⌁ Follow @0x94t3z</Button.Link>
    ],
  })
});

// Check $DEGEN Qualification
app.frame('/check', async (c) => {
  const { frameData } = c;
  const { fid } = frameData as unknown as { buttonIndex?: number; fid?: string };

  

  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=${fid}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS',
      },
    });
    
    const data = await response.json();
    const userData = data.users[0];


    const degen = await fetch(`https://www.degen.tips/api/airdrop2/tip-allowance?fid=${fid}`);

    const check = await degen.json();

    const message = (check && check.length > 0) 
    ? `Hi @${userData.username}, it looks like you're qualified :)`
    : `Hi @${userData.username}, it looks like you're disqualified :(`;

    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'radial-gradient(ellipse farthest-side, #F4603E, #432889)',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            color: 'white',
            fontFamily: 'Space Mono',
            fontSize: 35,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 0,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <p>{message}</p>
        </div>
      ),
      intents: [
        <Button action='/check'>⌁ Refresh</Button>,
        <Button.Link href='https://warpcast.com/0x94t3z'>⌁ Follow @0x94t3z</Button.Link>
      ],
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return c.res({
      image: (
          <div
              style={{
                  alignItems: 'center',
                  background: 'radial-gradient(ellipse farthest-side, #F4603E, #432889)',
                  backgroundSize: '100% 100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'nowrap',
                  height: '100%',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%',
                  color: 'white',
                  fontFamily: 'Space Mono',
                  fontSize: 35,
                  fontStyle: 'normal',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.4,
                  marginTop: 0,
                  padding: '0 120px',
                  whiteSpace: 'pre-wrap',
              }}
          >
            Uh oh, you clicked the button too fast! Please try again.
          </div>
      ),
      intents: [
          <Button action='/'>⏏︎ Try Again</Button>,
      ],
  });
  }
});

// Uncomment for local server testing
// devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
