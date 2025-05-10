export function useIndexNav() {
    const isLogin = useState("isLogin", () => false);

    const setRegister = () => {
        isLogin.value = false;
    }

    const setLogin = () => {
        isLogin.value = true;
    }

    return {
        isLogin,
        setRegister, 
        setLogin
    }
}
