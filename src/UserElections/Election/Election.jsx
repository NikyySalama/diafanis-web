import React, {useState} from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import UserLists from './Formula/UserLists';
import ElectionInfo from './ElectionInfo';
import Tables from './Tables/UserTables';
import UserParties from './Parties/UserParties';

const Election = () => {
    const location = useLocation();
    const { title } = location.state || { title: 'Título no disponible' };
    const [activeSection, setActiveSection] = useState('info');
    
    const renderSection = () => {
        switch (activeSection) {
            case 'parties':
                return <UserParties />
            case 'lists':
                return <UserLists />;
            case 'tables':
                return <Tables />;
            case 'info':
            default:
                return <ElectionInfo />;
        }
    };

    return (
        <div>
            <Navbar setActiveSection={setActiveSection} title={title}/>
            <div style={{marginTop:'5%'}}>
                {renderSection()}
            </div>
        </div>
    );
};

export default Election;
