import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useToast } from '../../hooks/toast';
import { FiLock } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ResetPasswordFormData {
    password_confirmation: string;
    password: string;
}

const ResetPassword: React.FC = () => {
    const { addToast } = useToast();
    const history = useHistory();
    const query = new URLSearchParams(useLocation().search);
    const formRef = useRef<FormHandles>(null);
    const handleSubmit = useCallback(
        async (data: ResetPasswordFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    password: Yup.string().required('Senha obrigatório'),
                    password_confirmation: Yup.string().oneOf(
                        [Yup.ref('password'), null],
                        'Confirmação incorreta',
                    ),
                });
                await schema.validate(data, { abortEarly: false });

                const { password, password_confirmation } = data;
                const token = query.get('token');
                if (!token) {
                    throw new Error();
                }
                await api.post('/password/reset', {
                    password,
                    password_confirmation,
                    token,
                });
                history.push('/');
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                }
                addToast({
                    type: 'error',
                    title: 'Erro ao resetar senha',
                    description:
                        'Ocorreu um erro ao resetar senha, tente novamente.',
                });
            }
        },
        [addToast, history, query],
    );
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Resetar Senha</h1>
                        <Input
                            name="password"
                            type="password"
                            icon={FiLock}
                            placeholder="Nova Senha"
                        />
                        <Input
                            name="password_confirmation"
                            type="password"
                            icon={FiLock}
                            placeholder="Confirmação da senha"
                        />
                        <Button type="submit">Alterar senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};
export default ResetPassword;
