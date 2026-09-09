interface propsTypes {
    heading: string;
    description: string;
}

const FormHeading = ({heading, description}:propsTypes) => {
  return (
    <>
        <div className="flex flex-col items-start gap-1 mb-3">
                    <h2 className="text-xl text-forground font-medium tracking-wider">{heading}</h2>
                    <h3 className="text-sm text-muted-foreground">{description}</h3>
                </div>
    </>
  )
}

export default FormHeading