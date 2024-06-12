const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, accessToken] = (authorization || "").split(" ");

    if (!accessToken || authType !== "Bearer") {
        return res.status(401).send({errorMessage: "로그인 후 이용 가능한 기능입니다."});
    }

    const isAccessTokenValidate = validateAccessToken(accessToken)
    if (!isAccessTokenValidate) {
        return res.status(401).send({errorMessage: "잘못된 토큰"});
    }

    return next()
}

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index.html')
});

app.post('/login', (req, res) => {
    const accessToken = jwt.sign({ id: req.body.id }, 'my_secret_key', { expiresIn: '1d' })
    res.cookie('accessToken', accessToken);

    // 클라이언트 -> 요청 ---> 서버
    //        <--------- 응답
    // 헤더 -> 요청과 응답사이에 추가적으로 필요한 메타데이터를 저장하는 공간
    // res.writeHead('Set-Cookie', {accessToken: accessToken})
    // 'Set-Cookie'


    return res.status(200).send({ "message": "Token이 정상적으로 발급되었습니다." });
})

app.post('/logout', authMiddleware, (req, res, next) => {
    res.clearCookie('accessToken')
});

function validateAccessToken(accessToken) {
    try {
        jwt.verify(accessToken, 'my_secret_key');
        return true;
    } catch (error) {
        return false;
    }
}

// const testMiddleWare = (req, res, next) => {
//     console.log('testMiddleware')
//     console.log('testMiddleware')
//     console.log('testMiddleware')
//     // return res.status(500).send({errorMessage: '에러발생'});
//     next()
// }

// /check_token => authMiddleware => testMiddleware => 비로소 API를 호출하고 싶다.
// 선행작업 => 권한체크
//         => validation 체크
// 클라이언트가 요청 --->  서버 -->  (authMiddleware)-> next ->  API를 호출한다. (API 가 일을 한다.) ---> 응답 ---> 클라이언트 받는다.

app.get('/check_token', authMiddleware, (req, res) => {
    console.log('인증이 되었으므로 다음 로직 실행')
    return res.status(200).send({message: 'success'});
})

app.post('/create_token', authMiddleware, (req, res) => {

})

app.post('/test_api2', authMiddleware, (req, res) => {

})

app.post('/test_api3', authMiddleware, (req, res) => {

})

app.post('/test_api4', authMiddleware, (req, res) => {

})

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});
