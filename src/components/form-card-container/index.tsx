import { AuxProps } from '../../ts/interfaces'

type Props = {
  cardTitle: string
  cardDescription: string
}

const FormCardContainer: React.FC<Props & AuxProps> = ({
  children,
  cardTitle,
  cardDescription
}) => (
  <div className="card fit-content mb-4">
    <div className="card-body">
      <h4 className="card-title">{cardTitle}</h4>
      <hr />
      {/* <br /> */}
      <p className="card-description">{cardDescription}</p>
      {children}
    </div>
  </div>
)

export default FormCardContainer
