import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
    );
};

export default AuthRoutes;