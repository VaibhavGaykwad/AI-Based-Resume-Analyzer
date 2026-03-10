import React, { useState } from 'react';
import { Mail, Lock, LogIn, Github, Chrome } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                alert('Successfully signed in!');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Account created successfully!');
            }
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
            alert('Successfully signed in with Google!');
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="login-header">
                <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                <p>{isLogin ? 'Enter your details to access your account' : 'Join our premium SaaS platform today'}</p>
            </div>

            <form onSubmit={handleEmailAuth}>
                <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            placeholder="name@company.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <div className="loading" style={{ margin: '0 auto' }}></div> : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <LogIn size={18} />
                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        </div>
                    )}
                </button>
            </form>

            <div className="divider">OR CONTINUE WITH</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={handleGoogleSignIn} className="btn-social" disabled={loading}>
                    <Chrome size={18} />
                    <span>Sign in with Google</span>
                </button>
                <button className="btn-social" disabled={loading}>
                    <Github size={18} />
                    <span>Sign in with GitHub</span>
                </button>
            </div>

            <div className="footer-link">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </a>
            </div>
        </div>
    );
};

export default Login;
