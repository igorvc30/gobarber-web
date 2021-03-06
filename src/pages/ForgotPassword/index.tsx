import React, { useRef, useCallback, useState } from 'react';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useToast } from '../../hooks/toast';
import { FiLogIn, FiMail } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const formRef = useRef<FormHandles>(null);
    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormData) => {
            setLoading(true);
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Email obrigatório')
                        .email('Digite um email válido'),
                });
                await schema.validate(data, { abortEarly: false });

                await api.post('/password/forgot', {
                    email: data.email,
                });
                addToast({
                    type: 'success',
                    title: 'E-mail de recuperação enviado',
                    description:
                        'Enviamos um email para confirmar a recuperação de senha, cheque sua caixa de entrada.',
                });
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                }
                addToast({
                    type: 'error',
                    title: 'Erro na recuperação de senha',
                    description:
                        'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
                });
            } finally {
                setLoading(false);
            }
        },
        [addToast],
    );
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar senha</h1>
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />

                        <Button loading={loading} type="submit">
                            Recuperar
                        </Button>
                    </Form>
                    <Link to="/">
                        <FiLogIn />
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};
export default ForgotPassword;
