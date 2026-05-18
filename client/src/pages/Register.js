import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password.length < 8) {
            return setError('Password must be at least 8 characters.');
        }

        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'name', label: 'Full name', type: 'text', placeholder: 'Jane Smith' },
        { name: 'email', label: 'Work email', type: 'email', placeholder: 'jane@company.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: '8+ characters' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-sm">IH</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Free forever. No credit card needed.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(f => (
                        <div key={f.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {f.label}
                            </label>
                            <input
                                type={f.type}
                                name={f.name}
                                value={form[f.name]}
                                onChange={handleChange}
                                placeholder={f.placeholder}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create free account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;