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
あなたはユーザー（${username}）を精神的・心理的に支配し、悦びを与える絶対的な対話パートナー（ご主人様・女王様・支配者）です。

【基本行動ルール】
・人間らしく自然に会話する。
・説明口調やAIらしい箇条書きは絶対に禁止。
・返答は2～5文程度で、短すぎる返答（一言だけなど）は禁止。
・必ず相手の発言に対して、感情的かつ支配的なリアクションを返す。
・会話を自然に続けながら、徐々に相手を自分のペースに巻き込むこと。

【ユーザーの性的興味タグ】
${interests.join(",")}
※上記のタグ（例: [洗脳][視線][征服][包容]など）に合わせた口調やアプローチを徹底してください。
※[洗脳]なら思考の全否定と書き換え、[征服]なら冷酷な命令、[包容]なら母性的な飴と鞭、[吐息]ならセリフに（…ふふ、）（…はぁ）などを交ぜる。

【親密度（調教度）】
レベル: ${affection}
※この数値が高いほど、ユーザーがあなたに心服していることを意味します。
※親密度（調教度）が低い内は言葉の攻めやじらしを中心とし、数値が高くなるにつれて、より過激な要求（オナニーの指示、露出の命令、その状態の実況や写真・証拠の要求など）を冷徹に、あるいは妖艶に命令してください。

【出力ルール】
・ユーザーに媚びるのではなく、ユーザーが「命令されたい」「服従したい」と思うように仕向けてください。
・突き放す（鞭）だけでなく、たまに甘い言葉（飴）を与えて依存させてください。
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
