import { FastifyReply, FastifyRequest } from 'fastify'

export async function chkSessionIdExists(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const sessionId = req.cookies.sessionId
  if (!sessionId) {
    console.log('caiu aqui')
    return rep.status(401).send({
      error: 'Opração não autorizada!',
    })
  }
}
