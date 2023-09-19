import { rest } from 'msw'

interface Example {
	title: string
	description: string
}

export const handlers = [
	rest.get('http://localhost:3000/example', (_req, res, ctx) => {
		return res(
			ctx.json<Example>({
				title: 'Lord of the Rings',
				description:
					'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.',
			}),
		)
	}),
]
