export default async function (req: Request): Promise<Response> {
  return Response.json({
    success: true,
    marker: "sendFeedback-minimal-test"
  });
}