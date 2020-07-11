import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { useAuth, AuthProvider } from '../../hooks/auth';

const apiMock = new MockAdapter(api);
describe('Auth hook', () => {
    it('should be able to sign in', async () => {
        const apiResponse = {
            user: {
                id: 'id',
                name: 'Igor Costa',
                email: 'igor@email.com',
            },
            token: 'token',
        };
        apiMock.onPost('sessions').reply(200, apiResponse);
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });
        result.current.signIn({
            email: 'igor@email.com',
            password: '123456',
        });
        await waitForNextUpdate();
        expect(setItemSpy).toHaveBeenCalledWith(
            '@Gobarber:token',
            apiResponse.token,
        );
        expect(setItemSpy).toHaveBeenCalledWith(
            '@Gobarber:user',
            JSON.stringify(apiResponse.user),
        );

        expect(result.current.user.email).toEqual('igor@email.com');
    });

    it('should restore saved data from storage when auth inits', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            switch (key) {
                case '@Gobarber:token':
                    return 'token';
                case '@Gobarber:user':
                    return JSON.stringify({
                        id: 'id',
                        name: 'Igor Costa',
                        email: 'igor@email.com',
                    });
                default:
                    return null;
            }
        });
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });
        expect(result.current.user.email).toEqual('igor@email.com');
    });

    it('should be able to sign out', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            switch (key) {
                case '@Gobarber:token':
                    return 'token';
                case '@Gobarber:user':
                    return JSON.stringify({
                        id: 'id',
                        name: 'Igor Costa',
                        email: 'igor@email.com',
                    });
                default:
                    return null;
            }
        });
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });
        act(() => {
            result.current.signOut();
        });
        expect(removeItemSpy).toHaveBeenCalledTimes(2);
        expect(result.current.user).toBeUndefined();
    });

    it('should be able to update user', async () => {
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });
        const user = {
            id: 'id',
            name: 'Igor Costa',
            email: 'igor@email.com',
            avatar_url: 'image',
        };
        act(() => {
            result.current.updateUser(user);
        });

        expect(setItemSpy).toHaveBeenCalledWith(
            '@Gobarber:user',
            JSON.stringify(user),
        );

        expect(result.current.user).toEqual(user);
    });
});
