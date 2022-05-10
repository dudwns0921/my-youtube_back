export function handleLogin(req, res) {
  console.log(req.body)
  return res.send('로그인 완료')
}

export function handleJoin(req, res) {
  console.log(req.body)
  return res.send('회원가입 요청')
}
