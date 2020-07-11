import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const { signIn } = useAuth();
    const { addToast } = useToast();
    const formRef = useRef<FormHandles>(null);
    const history = useHistory();
    const handleSubmit = useCallback(
        async (data: SignInFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Email obrigatório')
                        .email('Digite um email válido'),
                    password: Yup.string().required('Senha obrigatório'),
                });
                await schema.validate(data, { abortEarly: false });
                await signIn({
                    email: data.email,
                    password: data.password,
                });
                history.push('/dashboard');
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                    return;
                }
                addToast({
                    type: 'error',
                    title: 'Erro na autenticação',
                    description:
                        'Ocorreu um erro ao fazer login, cheque as credenciais!',
                });
            }
        },
        [signIn, addToast],
    );
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça o seu logon</h1>
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Input
                            name="password"
                            type="password"
                            icon={FiLock}
                            placeholder="Senha"
                        />
                        <Button type="submit">Entrar</Button>
                        <Link to="/forgot-password">Esqueci minha senha</Link>
                    </Form>
                    <Link to="/signup">
                        <FiLogIn />
                        Criar conta
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};
export default SignIn;
