import styled from "styled-components";
import { useAuth } from "../../context/auth_provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const handleLogout = () => {
      if (user) {
        logout();
        navigate("/");
      }
    };
    handleLogout();
  }, [logout, navigate, user]);
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-white">
      <StyledWrapper>
        <div className="wrapper-grid">
          {["L", "O", "G", "G", "I", "N", "G", "", "O", "U", "T"].map(
            (char, idx) => (
              <div key={idx} className={`cube ${char === "" ? "gap" : ""}`}>
                <div className="face face-front">{char}</div>
                <div className="face face-back" />
                <div className="face face-right" />
                <div className="face face-left" />
                <div className="face face-top" />
                <div className="face face-bottom" />
              </div>
            )
          )}
        </div>
      </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
  .wrapper-grid {
    --animation-duration: 2.1s;
    --cube-color: #0000;
    --highlight-color: #00cc44;
    --cube-width: 48px;
    --cube-height: 48px;
    --font-size: 1.8em;

    display: grid;
    grid-template-columns: repeat(11, var(--cube-width));
    perspective: 350px;

    font-family: "Poppins", sans-serif;
    font-size: var(--font-size);
    font-weight: 800;
    color: transparent;

    /* Center the grid */
    justify-content: center;
  }

  .cube {
    position: relative;
    transform-style: preserve-3d;
    animation: translate-z var(--animation-duration) ease-in-out infinite;
    will-change: transform;
  }

  .cube.gap {
    animation: none;
  }

  .face {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--cube-width);
    height: var(--cube-height);
    background-color: var(--cube-color);
  }

  .face-front {
    transform: rotateY(0deg) translateZ(calc(var(--cube-width) / 2));
  }
  .face-back {
    transform: rotateY(180deg) translateZ(calc(var(--cube-width) / 2));
    opacity: 0.6;
  }
  .face-left {
    transform: rotateY(-90deg) translateZ(calc(var(--cube-width) / 2));
    opacity: 0.6;
  }
  .face-right {
    transform: rotateY(90deg) translateZ(calc(var(--cube-width) / 2));
    opacity: 0.6;
  }
  .face-top {
    height: var(--cube-width);
    transform: rotateX(90deg) translateZ(calc(var(--cube-width) / 2));
    opacity: 0.8;
  }
  .face-bottom {
    height: var(--cube-width);
    transform: rotateX(-90deg)
      translateZ(calc(var(--cube-height) - var(--cube-width) * 0.5));
    opacity: 0.8;
  }

  /* Sequential animation delay */
  .cube:nth-child(1) { animation-delay: 0s; }
  .cube:nth-child(2) { animation-delay: 0.1s; }
  .cube:nth-child(3) { animation-delay: 0.2s; }
  .cube:nth-child(4) { animation-delay: 0.3s; }
  .cube:nth-child(5) { animation-delay: 0.4s; }
  .cube:nth-child(6) { animation-delay: 0.5s; }
  .cube:nth-child(7) { animation-delay: 0.6s; }
  .cube:nth-child(8) { animation-delay: 0.7s; }
  .cube:nth-child(9) { animation-delay: 0.8s; }
  .cube:nth-child(10) { animation-delay: 0.9s; }
  .cube:nth-child(11) { animation-delay: 1s; }

  .cube .face {
    animation:
      face-color var(--animation-duration) ease-in-out infinite,
      edge-glow var(--animation-duration) ease-in-out infinite;
    animation-delay: inherit;
  }

  .cube .face.face-front {
    animation:
      face-color var(--animation-duration) ease-in-out infinite,
      face-glow var(--animation-duration) ease-in-out infinite,
      edge-glow var(--animation-duration) ease-in-out infinite;
    animation-delay: inherit;
  }

  @keyframes translate-z {
    0%, 40%, 100% {
      transform: translateZ(-2px);
    }
    30% {
      transform: translateZ(16px) translateY(-1px);
    }
  }

  @keyframes face-color {
    0%, 50%, 100% {
      background-color: var(--cube-color);
    }
    10% {
      background-color: var(--highlight-color);
    }
  }

  @keyframes face-glow {
    0%, 50%, 100% {
      color: #fff0;
      filter: none;
    }
    30% {
      color: #fff;
      filter: drop-shadow(0 14px 10px var(--highlight-color));
    }
  }

  /* 📱 Responsive for small screens (≤ 400px) */
  @media (max-width: 430px) {
    .wrapper-grid {
      --cube-width: 28px;
      --cube-height: 28px;
      --font-size: 1em;
      grid-template-columns: repeat(11, var(--cube-width));
    }
  }
`;


export default LogoutPage;
