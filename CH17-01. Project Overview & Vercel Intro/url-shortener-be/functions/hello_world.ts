export function GET(req: Request) {
  return new Response("Hello World!")
}

export function POST(req: Request){
  return new Response("Hello With POST")
}