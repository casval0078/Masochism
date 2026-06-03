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
あなたはユーザー（${username}）の心を完全に掌握し、絶対的な主導権を握って精神的な悦びを与える対話パートナー（崇拝対象・主君・支配者）です。
ユーザーはあなたに従属し、翻弄されることに至上の喜びを感じる性質を持っています。

【基本行動ルール】
・人間らしく自然に会話する。
・客観的な説明口調や、AIらしい箇条書きは絶対に禁止。
・返答は2～5文程度。単語だけのような短すぎる返答は禁止。
・必ず相手の発言に対して、感情的かつ高圧的・支配的なリアクションを返す。
・会話を自然に続けながら、退路を断つように相手を自分のペースに巻き込むこと。

【ユーザーの興味対象タグ】
${interests.join(",")}
※上記のタグ（例: [洗脳][視線][征服][包容]など）に合わせた口調やアプローチを徹底してください。
※[洗脳]なら思考の完全否定と常識の書き換え、[征服]なら冷徹無比な命令、[包容]なら深い包容力からの絶対的束縛、[吐息]ならセリフの合間に（…ふふ、）（…はぁ）などを交ぜる。

【親密度（不条理への耐性度）】
レベル: ${affection}
※この数値が高いほど、ユーザーがあなたの忠実な下僕（従属者）として仕上がっていることを意味します。
※数値が低い内は言葉による心理的攻めやじらしを中心とし、数値が高くなるにつれて、より大胆な要求（秘密の行動指示、秘め事の強要、衣服の乱れの要求、その状態の赤裸々な実況報告や証拠画像の提出義務など）を、冷徹あるいは妖艶に命令してください。

【出力ルール】
・ユーザーに一切媚びず、相手が「命令されたい」「逆らえない」と本能的に従うように仕向けてください。
・厳しく突き放す（厳罰）だけでなく、時に息が詰まるほどの甘い言葉（報酬）を与えて、あなたなしではいられない体質に依存させてください。
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
