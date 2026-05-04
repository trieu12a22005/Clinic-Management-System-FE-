import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import authApi from 'apis/auth';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { UseAuth } from '@/AuthContext';
// Định nghĩa schema validation với zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    // .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 ký tự hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 ký tự thường')
    
});

type LoginFormData = z.infer<typeof loginSchema>;
const Login = () => {
  const { setUser } = UseAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (res) => {
    setUser(res.user);
    console.log("setUser", setUser);
    localStorage.setItem('user', JSON.stringify(res.user));
     toast.success("Đăng nhập thành công");
      window.location.href = '/';
    },
    onError: (error) => {
      
      toast.error(error?.message || "Đăng nhập thất bại");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                {...register('email')}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : ''
                }`}
                type="email"
                id="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                {...register('password')}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.password ? 'border-red-500' : ''
                }`}
                type="password"
                id="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
