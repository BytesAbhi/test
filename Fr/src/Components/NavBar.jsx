import React, { useState, useEffect } from "react";
import axios from "axios";

import { FaFacebookF } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdShoppingCart } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import Logo from "../assets/Logo.png";

const NavBar = () => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    fetchLatestImage();
  }, []);

  const fetchLatestImage = async () => {
    try {
      const response = await axios.get("http://localhost:3000/latest-image");
      const { filename } = response.data;

      if (filename) {
        setImage(`http://localhost:3000/uploads/${filename}`);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error("Error fetching latest image filename:", error);
      setImage(null);
    }
  };

  const NavLinks = [
    { Name: "Home", Link: "", Arrow: "" },
    { Name: "About Us", Link: "", Arrow: <FaAngleDown /> },
    { Name: "Courses", Link: "", Arrow: <FaAngleDown /> },
    { Name: "Industerial Training", Link: "", Arrow: <FaAngleDown /> },
    { Name: "Blog", Link: "", Arrow: "" },
    { Name: "Contact Us", Link: "", Arrow: "" },
  ];
  const SocialLinks = [
    { Link: <FaFacebookF />, Sociallink: "" },
    { Link: <FaTwitter />, Sociallink: "" },
    { Link: <BsInstagram />, Sociallink: "" },
    { Link: <FaYoutube />, Sociallink: "" },
    { Link: <FaLinkedinIn />, Sociallink: "" },
  ];

  return (
    <nav>
      <span className="Social-Links-Span">
        <div className="contact-link">
          <a href="">
            <FaPhoneAlt /> +91-7056497000
          </a>
          <a href="">
            <IoMdMail />
            info@futureittouch.com
          </a>
        </div>
        <div className="Social-Links">
          <span>
            {SocialLinks.map((item, i) => (
              <section key={i} className="">
                <a href="">{item.Link}</a>
              </section>
            ))}
          </span>
          <div>
            <span>
              <MdShoppingCart />
            </span>
            <div className="sec-center">
              <input
                className="dropdown"
                type="checkbox"
                id="dropdown"
                name="dropdown"
              />
              <label className="for-dropdown" htmlFor="dropdown">
                User
                <FaAngleDown />
              </label>
              <div className="section-dropdown">
                <a href="#" className="cbshjbjcbjsbjdvhj">
                  Sign In
                </a>
                <a href="#" className="cbshjbjcbjsbjdvhj">
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </span>
      <span className="Navlink">
        <div>
          {image && <img src={image} alt="Logo" className="Logoimage" />}
          <a href="">
            <GiHamburgerMenu />
            Category
          </a>
        </div>
        <ul>
          {NavLinks.map((item, index) => (
            <li key={index}>
              <a href="">
                {item.Name}
                {item.Arrow}
              </a>
            </li>
          ))}
        </ul>
      </span>
    </nav>
  );
};

export default NavBar;
