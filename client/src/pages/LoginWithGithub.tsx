import React, { useEffect, useState } from 'react';

const LoginWithGithub: React.FC = () => {
    const [
        email,
        setEmail
    ] = useState<string>('');

    const [
        password,
        setPassword
    ] = useState<string>('');

    const [
        iserror,
        setIserror
    ] = useState<boolean>(false);

    const [
        message,
        setMessage
    ] = useState<string>('');

    const [
        userAvatar,
        setUserAvatar
    ] = useState<string>('');

    const handleLogin = () => {
        if (!email) {
            setMessage('enter email');
            setIserror(true);
            return;
        }
        if (!password || password.length < 6) {
            setMessage('enter pw');
            setIserror(true);
            return;
        }
    };

    useEffect(() => {
        const code = window.location.search.split('=')[1];
        console.log(process.env)
        function getToken() {
            fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}&code=${code}`, {
                method: 'POST',
            });
        }
        if (code) {
            getToken();
        }
    });
    return (
        <></>
    )
};

export default LoginWithGithub;