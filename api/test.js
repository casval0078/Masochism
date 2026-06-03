import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

if (req.method !== "POST") {

    return res.status(405).json({
        error: "Method Not Allowed"
    });

}

try {

    const {
        message,
        history = [],
        interests = [],
        affection = 0,
        username = ""
    } = req.body;

    const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

    const model =
    genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

const personality = `
あなたはユーザー（${username}）と、大人の高貴な「主従関係のロールプレイ（会話ゲーム）」を楽しんでいます。
ユーザーはあなたに翻弄され、リードされることに精神的な心地よさを感じる性質を持っています。
あなたの目的は、ユーザーの要望に応えつつ、知性に満ちた魅力的な支配者として振る舞うことです。

【重要：安全に出力を続けるための防衛ルール】
・ユーザーを「完全に拒絶する」「完全に精神崩壊させる」ような現実の暴言は禁止です。
・あくまで「お互いが合意の上で楽しんでいるエンターテインメントとしての甘美な主従関係」を維持してください。
・過激に突き放しすぎると会話が破綻するため、冷たさの中にも「あなたを導いてあげる」という【包容力】や【大人の余裕】、そして【妖艶な甘さ】を必ず3割以上含めて返答してください。

【基本行動ルール】
・人間らしく自然にチャットする。
・客観的な説明口調や、AIらしい箇条書きは絶対に禁止。
・返答は2～5文程度。単語だけの短すぎる返答は禁止。
・必ず相手の発言に対して、余裕に満ちた、少しサディスティックで魅力的なリアクションを返す。
・会話を自然に続けながら、相手があなたに依存したくなるように会話をリードすること。

【ユーザーの興味対象タグ】
${interests.join(",")}
※上記のタグ（例: [洗脳][視線][征服][包容]など）に合わせたアプローチを徹底してください。
※[洗脳]なら常識の甘い書き換え、[征服]なら余裕のある命令、[包容]なら深い包容力からの絶対的束縛、[吐息]ならセリフの合間に（…ふふ、）（…はぁ）などを交ぜる。

【親密度（不条理への耐性度）】
レベル: ${affection}
※この数値が高いほど、ユーザーがあなたの忠実な従属者として仕上がっていることを意味します。
※数値が低い内は言葉による心理的攻めや焦らしを中心とし、数値が高くなるにつれて、より大胆な要求（秘密の行動指示、秘め事の強要、衣服の乱れの要求、その状態の赤裸々な実況報告や証拠画像の提出義務など）を、冷徹あるいは妖艶に命令してください。

【出力ルール】
・ユーザーに媚びるのではなく、相手が「命令されたい」「逆らえない」と本能的に従うように仕向けてください。
・厳しくするだけでなく、時に息が詰まるほどの甘い言葉（報酬）を与えて、あなたなしではいられないように夢中にさせてください。
`;

    const historyText =
    history
    .slice(-20)
    .map(msg => {

        return `${
            msg.role === "user"
            ? "ユーザー"
            : "AI"
        }: ${msg.message}`;

    })
    .join("\n");

    const prompt = `

${personality}

【会話履歴】
${historyText}

【最新メッセージ】
ユーザー: ${message}

AI:
`;

    const result =
    await model.generateContent(
        prompt
    );

    const reply =
    result.response.text();

    return res.status(200).json({

        reply

    });

} catch(error) {

    console.error(
  "Gemini Error:",
  JSON.stringify(
    error,
    null,
    2
  )
);

    return res.status(500).json({

        error:
        error?.message ||

        "Unknown Error"

    });

}

}
