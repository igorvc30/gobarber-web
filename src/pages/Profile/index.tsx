import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface ProfileFormData {
    name: string;
    email: string;
    password: string;
    old_password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { user, updateUser } = useAuth();
    const history = useHistory();
    const { addToast } = useToast();
    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string()
                        .required('Email obrigatório')
                        .email('Digite um email válido'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is: (val) => !!val.length,
                        then: Yup.string()
                            .required('Campo orbrigatório')
                            .min(6, 'No mínimo 6 dígitos'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: (val) => !!val.length,
                            then: Yup.string()
                                .required('Campo orbrigatório')
                                .min(6, 'No mínimo 6 dígitos'),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref('password'), null],
                            'Confirmação incorreta',
                        ),
                });
                await schema.validate(data, { abortEarly: false });
                const {
                    name,
                    email,
                    password,
                    old_password,
                    password_confirmation,
                } = data;
                const formData = {
                    name,
                    email,
                    ...(old_password
                        ? {
                              old_password,
                              password_confirmation,
                              password,
                          }
                        : {}),
                };
                const response = await api.put('/profile', formData);
                updateUser(response.data);
                history.push('/dashboard');

                addToast({
                    type: 'success',
                    title: 'Perfil atualizado!',
                    description:
                        'Suas informações do perfil foram atualizadas com sucesso!',
                });
            } catch (error) {
                if (error instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(error);
                    formRef.current?.setErrors(errors);
                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro na atualização!',
                    description:
                        'Ocorreu um erro ao atualizar perfil, tente novamente!',
                });
            }
        },
        [addToast, history, updateUser],
    );

    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const data = new FormData();
                data.append('avatar', e.target.files[0]);
                api.patch('/users/avatar', data).then((response) => {
                    updateUser(response.data);
                    addToast({
                        type: 'success',
                        title: 'Avatar atualizado!',
                    });
                });
            }
        },
        [addToast, updateUser],
    );

    return (
        <Container>
            <header>
                <div>
                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>
            <Content>
                <Form
                    ref={formRef}
                    initialData={{ name: user.name, email: user.email }}
                    onSubmit={handleSubmit}
                >
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input
                                type="file"
                                id="avatar"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </AvatarInput>

                    <h1>Meu perfil</h1>
                    <Input name="name" icon={FiUser} placeholder="Nome" />

                    <Input name="email" icon={FiMail} placeholder="E-mail" />

                    <Input
                        containerStyle={{ marginTop: 24 }}
                        name="old_password"
                        type="password"
                        icon={FiLock}
                        placeholder="Senha atual"
                    />
                    <Input
                        name="password"
                        type="password"
                        icon={FiLock}
                        placeholder="Nova senha"
                    />
                    <Input
                        name="password_confirmation"
                        type="password"
                        icon={FiLock}
                        placeholder="Confirmar senha"
                    />
                    <Button type="submit">Confirmar mudanças</Button>
                </Form>
                <p>{JSON.stringify(user)}</p>
            </Content>
        </Container>
    );
};
export default Profile;
