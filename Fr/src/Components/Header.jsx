import { PiStudentFill } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";

import "./Header.css";

const Header = (Ser) => {
  // console.log(Ser.SerSer)


  return (
    <div className="education-platform" key={Ser.Ser._id}>
      <div className="chjsvajvcshjsvah width">
        <h4>For a better future</h4>
        <h3>{Ser.Ser.heading}</h3>
        <p>{Ser.Ser.description}</p>
        <span className="cbhgcdgsvhsvghvhd">
          <input placeholder="Search Your Courses" />
          <button>Search</button>
        </span>
        <div className="hshvchvhsv">
          <span>
            32M
            <span>Learners</span>
          </span>
          <span>
            200M
            <span>Countriess</span>
          </span>
          <span>
            8.1k
            <span>Courses</span>
          </span>
        </div>
      </div>
      <div className="chjsvhgvchjb width">
        <div className="updetails">
          <PiStudentFill />
          <span className="chjsvhvchjsbhhj">
            <span>25K</span>
            <span> Assisted Student</span>
          </span>
        </div>

        <img src={`http://localhost:3000/uploads/${Ser.Ser.image}`} />
        <div className="downdetails">
          <FaCheckCircle />
          <span className="chjsjasbcbhdn">
            <span>Congrulation</span>
            <span> your Admission Completed</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
