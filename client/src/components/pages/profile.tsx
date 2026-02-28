import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                if (!cancelled) {
                    const response = await fetch('/api/auth/me');
                    if (response.status === 401) {
                        navigate(confirm('Not logged in?')? '/auth' : '/');
                        return;
                    }

                    const data = await response.json();
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    return(
        <>
            Profile
        </>
    )
}

export default Profile;