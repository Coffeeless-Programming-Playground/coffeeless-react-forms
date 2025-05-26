import { AuxProps } from '../../ts/interfaces'

type Props = {
  col: 'col-md-6' | 'col-md-12'
}

const Section: React.FC<Props & AuxProps> = ({ children, col }) => (
  <div className={`${col} grid-margin stretch-card flex-column`}>{children}</div>
)

export default Section
