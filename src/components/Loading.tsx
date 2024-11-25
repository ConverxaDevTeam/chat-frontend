import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={classes.container}>
      <div className={classes.loader}></div>
      <img src="/images/logo200.png" alt="logo" className={classes.img} />
      <img src="/images/logo610.png" alt="logo" className={classes.imgText} />
    </div>
  );
};

export default Loading;
