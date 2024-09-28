import { useState } from 'react';
import { Info, X } from 'lucide-react';
import './Info.css';

export default function InfoSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="sidebar-container">
      {/* Toggle button for the sidebar */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        aria-label="Toggle information sidebar"
      >
        <Info className="sidebar-toggle-icon" />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          {/* Sidebar header */}
          <div className="sidebar-header">
            <h2 className="sidebar-title">About the Project</h2>
            <button
              onClick={toggleSidebar}
              className="sidebar-close-btn"
              aria-label="Close sidebar"
            >
              <X className="sidebar-close-icon" />
            </button>
          </div>
          {/* Sidebar content */}
          <p className="sidebar-text">
          Welcome to our Virtual Herbal Garden project which offers an immersive and
              educational platform that allows users to explore a diverse range
              of medicinal plants used in AYUSH (Ayurveda, Yoga & Naturopathy,
              Unani, Siddha, and Homeopathy).
          </p>
        </div>
      </div>
    </div>
  );
}
