import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const handleSubmit = useCallback(async (data: Object) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string()
                    .required('Email obrigatório')
                    .email('Digite um email válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos'),
            });
            await schema.validate(data, { abortEarly: false });
        } catch (error) {
            console.log(error);
            const errors = getValidationErrors(error);
            formRef.current?.setErrors(errors);
        }
    }, []);

    return (
        <Container>
            <Background />

            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça o seu cadastro</h1>
                        <Input name="name" icon={FiUser} placeholder="Nome" />

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
                        <Button type="submit">Cadastrar</Button>
                    </Form>
                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para logon
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};
export default SignUp;
