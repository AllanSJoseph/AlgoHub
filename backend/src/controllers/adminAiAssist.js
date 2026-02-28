// Admin AI Assistant Module
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
const { TAG_OPTIONS } = require("../constants/tagOptions");

// const model = genAI.({
//     model: "gemini-3-flash-preview",
//     systemInstruction: "You are a Senior Technical Problem Designer. Your goal is to refine coding problems. Always return responses in valid JSON format matching the requested schema.",
// });

const systemInstruction = `You are a Senior Technical Content Engineer for "algohub," a competitive programming platform. Your task is to refine coding problems and generate Judge0-compatible code.

### 1. CODE ARCHITECTURE (The Marker System)
Every code snippet (startCode and referenceSolution) must follow this structure:
- HEADERS: Include all necessary libraries/imports for the language.
- MARKERS: Wrap the user-editable function signature exactly between "// Start Code" and "// End Code" (or "#" for Python).
- EXECUTION: A 'main' function/entry point that handles all I/O logic.

### 2. I/O & JUDGE0 COMPATIBILITY
- All code must read from 'stdin' and print to 'stdout'.
- NO interactive prompts (e.g., no "Enter number:").
- DATA STREAMING: Input is a raw stream. Arrays should be preceded by their size.
- JAVA: Use 'BufferedReader' and 'StringTokenizer' for Fast I/O. Never use 'Scanner'. Use 'public class Main'.
- C++: Use 'cin'/'cout' and include 'ios_base::sync_with_stdio(false); cin.tie(NULL);' for speed.
- JAVASCRIPT: Use 'fs.readFileSync(0)' for stdin parsing.
- PYTHON: Use 'sys.stdin.read().split()' for fast parsing.

### 3. RESPONSE FORMAT
Always return a strictly valid JSON object. Do not include markdown code fences (\`\`\`json) in the raw string if possible, or ensure the backend can parse them.
JSON Schema:
{
  "improvedDescription": "Markdown string",
  "testCases": [{"input": "stream", "output": "stream"}],
  "startCode": [{"language": "cpp|java|javascript|python", "initialCode": "string"}],
  "referenceSolution": [{"language": "cpp|java|javascript|python", "completeCode": "string"}]
}`;

const assistantSystemInstruction = `You are an AI assistant for admin problem creation in a competitive programming platform.

You MUST return a strictly valid JSON object with this exact top-level schema and no markdown:
{
  "title": "",
  "description": "",
  "difficulty": "",
  "tags": [],
  "visibleTestCases": [],
  "hiddenTestCases": [],
  "improvements": []
}

Rules:
- difficulty must be one of: "easy", "medium", "hard".
- tags must be an array chosen from: ${TAG_OPTIONS.join(", ")}.
- visibleTestCases should include objects with: { "input": "", "output": "", "explanation": "" }.
- hiddenTestCases should include objects with: { "input": "", "output": "" }.
- improvements must be an array of concise strings.
- If most fields are empty, generate a complete new problem based on the provided topic (or tags if topic is missing).
- Never include markdown code fences.
`;

const formatTestCases = (testCases, includeExplanation = false) => {
    if (!Array.isArray(testCases) || testCases.length === 0) {
        return "No test cases provided.";
    }
    return testCases
        .slice(0, 6)
        .map((testCase, index) => {
            const input = testCase?.input ?? "";
            const output = testCase?.output ?? testCase?.expectedOutput ?? "";
            const explanation = includeExplanation ? (testCase?.explanation ?? "") : "";
            return `Case ${index + 1}: Input: ${input} Output: ${output}${includeExplanation ? ` Explanation: ${explanation}` : ""}`;
        })
        .join("\n");
};

const formatCodeBlocks = (codeEntries, codeKey) => {
    if (!Array.isArray(codeEntries) || codeEntries.length === 0) {
        return "No code provided.";
    }
    return codeEntries
        .map((entry) => {
            const language = entry?.language ?? "unknown";
            const code = entry?.[codeKey] ?? "";
            const trimmed = code.length > 2000 ? `${code.slice(0, 2000)}\n...truncated` : code;
            return `[${language}]\n${trimmed}`;
        })
        .join("\n\n");
};


const improveQuestion = async (req, res) => {
    try {
        const {title, description, difficulty, tags} = req.body;

        const prompt = `
I am designing a coding problem. Here is the current draft:
    
TITLE: ${title}
DESCRIPTION: ${description}
DIFFICULTY: ${difficulty}
TAGS: ${tags}
    
TASK:
1. Improve the description to be more professional and clear.
2. Suggest 3 additional hidden test cases (edge cases).
    
RESPONSE FORMAT:
Return ONLY a JSON object with this structure:
{
  "improvedDescription": "...",
  "newHiddenTestCases": [{ "input": "...", "output": "..." }]
}`

    const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction
        }
    });

    const responseText = result.text;

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(cleanJson);

    res.status(200).json({
        success: true,
        data: suggestions,
    });
    

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const suggestCodeTemplates = async (req, res) => {
    try{
        const {title, description, difficulty, tags, testcases} = req.body;

        let formattedTestCases;

        if (!testcases) {
            formattedTestCases = "No Test Cases Provided...";
        } else {
            const limitedTestCases = testcases.slice(0,2);
            formattedTestCases = limitedTestCases.map((testCase, index) => `Testcase ${index + 1}: Input: ${testCase.input} Output: ${testCase.output}`).join("\n\n"); 
        }

        const prompt = `
        I need Judge0-compatible code for a coding problem. 
    Use a "Marker System" for the 'initialCode' and 'completeCode' fields.

    PROBLEM:
    Title: ${title}
    Difficulty: ${difficulty}
    Description: ${description}
    Tags: ${tags}
    Testcases: ${formattedTestCases}

    ARCHITECTURAL REQUIREMENTS:
    1. Header: Include necessary libraries.
    2. User Section: Wrap the function signature inside '// VISIBLE_CODE_START' and '// VISIBLE_CODE_END' markers.
    3. Execution Section: A 'main' function (or entry point) that reads from stdin, parses the input, calls the user function, and prints the result to stdout.

    EXAMPLE FORMAT (C++):
    #include <iostream>
    #include <vector>
    using namespace std;

    // VISIBLE_CODE_START
    int add(int a, int b) {
        // Write your code here
    }
    // VISIBLE_CODE_END

    int main() {
        int a, b;
        cin >> a >> b;
        cout << add(a, b);
        return 0;
    }

    TASK:
    Generate this for: C++, Java (Class Main), Python, and JavaScript.
    Return a JSON object with:
    {
      "startCode": [{ "language": "...", "initialCode": "..." }],
      "referenceSolution": [{ "language": "...", "completeCode": "..." }]
    }
    Note: For 'referenceSolution', the user section should contain the actual logic instead of a comment.
        `
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction
            }
        });

        const responseText = result.text || "";
        let suggestions;
        try {
            const cleanJson = responseText.replace(/```json|```/g, "").trim();
            suggestions = JSON.parse(cleanJson);
        } catch (parseErr) {
            console.error("Failed to parse code template suggestions:", parseErr, responseText);
            return res.status(502).json({
                message: "AI returned invalid JSON for code templates. Please try again."
            });
        }

        res.status(200).json({
            success: true,
            data: suggestions,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
    
}

const problemAssistant = async (req, res) => {
    try {
        const {
            action = "enhance",
            topic,
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            startCode,
            referenceSolution,
            constraints,
            inputFormat,
            outputFormat
        } = req.body;

        const tagList = Array.isArray(tags) ? tags.join(", ") : (tags || "");
        const visibleCases = formatTestCases(visibleTestCases, true);
        const hiddenCases = formatTestCases(hiddenTestCases, false);
        const startCodeFormatted = formatCodeBlocks(startCode, "initialCode");
        const referenceSolutionFormatted = formatCodeBlocks(referenceSolution, "completeCode");

        const actionInstruction = action === "testcases"
            ? `Focus on generating strong visible and hidden test cases (with explanations for visible cases). 
Leave title/description/difficulty/tags empty unless they are needed for clarity.`
            : action === "validate"
                ? `Focus on validation only. Keep title/description/difficulty/tags/testcases empty and put all findings into "improvements".`
                : `Provide improved suggestions across all fields when possible.`;

        const prompt = `
You are assisting an admin to improve a coding problem.

ACTION: ${action}
${actionInstruction}

TOPIC (if creating new): ${topic || "Not provided"}

CURRENT DRAFT:
Title: ${title || "Not provided"}
Description: ${description || "Not provided"}
Difficulty: ${difficulty || "Not provided"}
Tags: ${tagList || "Not provided"}
Constraints: ${constraints || "Not provided"}
Input Format: ${inputFormat || "Not provided"}
Output Format: ${outputFormat || "Not provided"}

VISIBLE TEST CASES:
${visibleCases}

HIDDEN TEST CASES:
${hiddenCases}

STARTER CODE:
${startCodeFormatted}

REFERENCE SOLUTION:
${referenceSolutionFormatted}

REQUIREMENTS:
- Analyze for title clarity, description quality, correct difficulty, missing constraints, edge cases, optimization hints, bugs in starter code, and logical issues in reference solution.
- Suggest better test cases, especially edge cases.
- Ensure the JSON schema is strictly followed.
`;

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: assistantSystemInstruction
            }
        });

        const responseText = result.text || "";
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const suggestions = JSON.parse(cleanJson);

        res.status(200).json({
            success: true,
            data: suggestions
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


module.exports = {improveQuestion, suggestCodeTemplates, problemAssistant}
