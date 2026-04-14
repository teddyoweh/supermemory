import "dotenv/config"
import { openai } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import {
	withSupermemory,
	supermemoryTools,
	searchMemoriesTool,
	addMemoryTool,
	type MemoryPromptData,
} from "@supermemory/tools/ai-sdk"

async function testMiddleware() {
	console.log("=== Middleware ===")

	// Basic wrapper
	const model = withSupermemory({
		model: openai("gpt-4"),
		containerTag: "user-123",
		customId: "conv-001",
	})
	console.log("✓ withSupermemory basic")

	// With addMemory option
	const modelWithAdd = withSupermemory({
		model: openai("gpt-4"),
		containerTag: "user-123",
		customId: "conv-002",
		addMemory: "always",
	})
	console.log("✓ withSupermemory with addMemory")

	// With verbose logging
	const modelVerbose = withSupermemory({
		model: openai("gpt-4"),
		containerTag: "user-123",
		customId: "conv-003",
		verbose: true,
	})
	console.log("✓ withSupermemory with verbose")
}

async function testSearchModes() {
	console.log("\n=== Search Modes ===")

	const profileModel = withSupermemory({
		model: openai("gpt-4"),
		containerTag: "user-123",
		customId: "conv-004",
		mode: "profile",
	})
	console.log("✓ mode: profile")

	const queryModel = withSupermemory({
		model: openai("gpt-4"),
		containerTag: "user-123",
		customId: "conv-005",
		mode: "query",
	})
	console.log("✓ mode: query")

	const fullModel = withSupermemory({
		model: openai("gpt-4"),
		containerTag: "user-123",
		customId: "conv-006",
		mode: "full",
	})
	console.log("✓ mode: full")
}

async function testCustomPrompt() {
	console.log("\n=== Custom Prompt Template ===")

	const anthropic = createAnthropic({ apiKey: "test-key" })

	const claudePrompt = (data: MemoryPromptData) =>
		`
<context>
  <user_profile>${data.userMemories}</user_profile>
  <relevant_memories>${data.generalSearchMemories}</relevant_memories>
</context>
`.trim()

	const model = withSupermemory({
		model: anthropic("claude-3-sonnet-20240229"),
		containerTag: "user-123",
		customId: "conv-007",
		mode: "full",
		promptTemplate: claudePrompt,
	})
	console.log("✓ Custom prompt template")
}

async function testTools() {
	console.log("\n=== Memory Tools ===")

	// All tools
	const tools = supermemoryTools({
		apiKey: "YOUR_API_KEY",
	})
	console.log("✓ supermemoryTools")

	// Individual tools
	const searchTool = searchMemoriesTool({
		apiKey: "API_KEY",
		projectId: "personal",
	})
	console.log("✓ searchMemoriesTool")

	const addTool = addMemoryTool({
		apiKey: "API_KEY",
	})
	console.log("✓ addMemoryTool")

	// Combined
	const toolsObj = {
		searchMemories: searchTool,
		addMemory: addTool,
	}
	console.log("✓ Combined tools object", Object.keys(toolsObj))
}

async function main() {
	console.log("AI SDK Integration Tests")
	console.log("========================\n")

	await testMiddleware()
	await testSearchModes()
	await testCustomPrompt()
	await testTools()

	console.log("\n========================")
	console.log("✅ All AI SDK tests passed!")
}

main().catch(console.error)
