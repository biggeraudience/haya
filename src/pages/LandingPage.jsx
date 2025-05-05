import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/landingpage.scss";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <main className="landing-page">
        <section className="hero-section">
          <div className="hero-overlay">
            <p className="hero-text">
            <strong>Welcome to Haya</strong>, where fashion is more than just clothing – it's a canvas for self‑expression and a celebration of individuality. We curate collections for both men and women who see their wardrobe as an extension of their unique stories and aspirations. Explore our thoughtfully selected pieces, from everyday essentials to statement styles, designed to empower you to look and feel your best, effortlessly. Your journey to defining your image starts here.
            </p>
            <button className="cta-button">Create Account</button>
          </div>
        </section>

        <section className="gender-section">
          <div className="gender-box men-box">
            <img
              src="\src\assets\images\7000779701_01.jpg"
              alt="Men's Collection"
              className="gender-img-men"
            />
            
            <button className="gender-button" onClick={() => navigate("/menslandingpage")}>
              Men
            </button>            
            <div className="gender-overlay">
              <p>Placeholder text for men’s collection</p>
            </div>
            
          </div>

          <div className="gender-box women-box">
            <img
              src="\src\assets\images\22-04-20Sofinas-32_fa9c76c4-384f-4fc0-9895-a7ff99a936db_1024x1024.webp"
              alt="Women's Collection"
              className="gender-img-women"
            />
            <button className="gender-button" onClick={() => navigate("/womenslandingpage")}>
              Women
            </button>            
            <div className="gender-overlay">
              <p>Placeholder text for women’s collection</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
