export function Button({text,className, ...props}){
  return (
    <button {...props} className={className}>
      {text}
    </button>   
  );
}