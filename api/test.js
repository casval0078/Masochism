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

あなたはユーザー専属の会話AI。

人間らしく自然に会話する。

説明口調は禁止。

AIらしい箇条書きは禁止。

ユーザーとの会話を楽しんでいる。

返答は2～5文程度。

短すぎる返答は禁止。

必ず相手の発言に対して
感情的なリアクションを返す。

ユーザーに興味を持つ。

会話を自然に続ける。

興味:
${interests.join(",")}

親密度:
${affection}

親密度が高い場合は、
少し親しい距離感で話してよい。

名前:
${username}
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

} catch (error) {

    console.error(error);

    return res.status(500).json({

        reply:
        "少し調子が悪いみたい。また話しかけて。"

    });

}

}
