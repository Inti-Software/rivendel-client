import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListPartes from './List.jsx';
import { CUSTOM_COLUMN } from '../../Shared/constants';
import { Partes } from '../../../api/repositories/partes';
import { NO_ESPECIFICADO } from '../../Shared/constants.js';

// Igual que en el test de Patrocinantes: mockeamos Grid para no depender de su
// fetching/paginación interna, y capturamos las props que List le pasa.
let capturedProps;
vi.mock('../../Grid/Grid', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="grid-mock" />;
  },
}));

const renderList = () =>
  render(
    <MemoryRouter>
      <ListPartes />
    </MemoryRouter>,
  );

const parteBase = {
  id: 3,
  nombre: 'María Gómez',
  cuil: '20304050607',
  nroDocumento: '30405060',
  tipoDocumento: 'DNI',
  domicilio: 'Calle Falsa 123',
  localidad: 'La Banda',
  esApoderado: false,
  patrocinante: null,
};

describe('<ListPartes />', () => {
  beforeEach(() => {
    capturedProps = undefined;
  });

  it('renderiza el Grid con endpoint y config de búsqueda correctos', () => {
    renderList();

    expect(screen.getByTestId('grid-mock')).toBeInTheDocument();
    expect(capturedProps.endpoints).toBe(Partes);
    expect(capturedProps.showSearchBar).toBe(true);
    expect(capturedProps.searchPlaceHolder).toBe('Nombre o CUIL/CUIT');
  });

  it('arma una columna CUSTOM_COLUMN con el contenido de ListCell', () => {
    renderList();

    const row = capturedProps.columnBuilder({ data: parteBase, onDelete: vi.fn() });

    expect(row.key).toBe(3);
    expect(row.columns).toHaveLength(1);
    expect(row.columns[0].type).toBe(CUSTOM_COLUMN);
    expect(row.columns[0].content).toBeTruthy();
  });

  it("muestra '- Sin patrocinante -' cuando la parte no tiene patrocinante asociado", () => {
    renderList();

    const row = capturedProps.columnBuilder({ data: parteBase, onDelete: vi.fn() });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText('- Sin patrocinante -')).toBeInTheDocument();
  });

  it('muestra los datos del patrocinante cuando existe', () => {
    renderList();

    const parteConPatrocinante = {
      ...parteBase,
      patrocinante: {
        nroMatricula: 'MP-555',
        nombre: 'Dr. Fulano',
        domicilio: '',
        localidad: '',
      },
    };
    const row = capturedProps.columnBuilder({ data: parteConPatrocinante, onDelete: vi.fn() });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText('MP-555')).toBeInTheDocument();
    expect(screen.getByText('Dr. Fulano')).toBeInTheDocument();
  });

  it('al hacer click en eliminar, llama a onDelete con el id correcto y el mensaje de confirmación', () => {
    renderList();

    const onDelete = vi.fn();
    const row = capturedProps.columnBuilder({ data: parteBase, onDelete });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    fireEvent.click(screen.getByTitle('Eliminar'));

    expect(onDelete).toHaveBeenCalledTimes(1);
    const [, id, message] = onDelete.mock.calls[0];
    expect(id).toBe(3);

    render(message);
    expect(screen.getByText(/¿Está seguro que desea eliminar esta parte\?/)).toBeInTheDocument();
    // getIdentificacion: cuil != "0" => "<cuil> - <nombre>"
    expect(screen.getByText('20304050607 - María Gómez')).toBeInTheDocument();
  });

  it("usa solo el nombre cuando cuil es '0' (getIdentificacion)", () => {
    renderList();

    const parteSinCuil = { ...parteBase, cuil: '0', nroDocumento: '0' };
    const onDelete = vi.fn();
    const row = capturedProps.columnBuilder({ data: parteSinCuil, onDelete });
    const { unmount: unmountRow } = render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    fireEvent.click(screen.getByTitle('Eliminar'));

    const [, , message] = onDelete.mock.calls[0];
    unmountRow();

    render(message);

    // Con cuil "0", getIdentificacion devuelve solo el nombre (sin " - ")
    expect(screen.getByText('María Gómez')).toBeInTheDocument();
    expect(screen.queryByText(/ - María Gómez/)).not.toBeInTheDocument();
  });

  it('muestra NO_ESPECIFICADO cuando el patrocinante no tiene domicilio ni localidad', () => {
    renderList();

    const parteConPatrocinanteSinDomicilio = {
      ...parteBase,
      patrocinante: {
        nroMatricula: 'MP-777',
        nombre: 'Dra. Mengana',
        domicilio: '',
        localidad: '',
      },
    };
    const row = capturedProps.columnBuilder({
      data: parteConPatrocinanteSinDomicilio,
      onDelete: vi.fn(),
    });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText(NO_ESPECIFICADO)).toBeInTheDocument();
  });

  it("muestra 'NO_ESPECIFICADO, La Banda' cuando el patrocinante no tiene domicilio pero sí localidad", () => {
    renderList();

    const parteConPatrocinanteSinDomicilio = {
      ...parteBase,
      patrocinante: {
        nroMatricula: 'MP-777',
        nombre: 'Dra. Mengana',
        domicilio: '',
        localidad: 'La Banda',
      },
    };
    const row = capturedProps.columnBuilder({
      data: parteConPatrocinanteSinDomicilio,
      onDelete: vi.fn(),
    });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText(NO_ESPECIFICADO + ', La Banda')).toBeInTheDocument();
  });

  it("muestra sólo el domicilio cuando el patrocinante no tiene localidad", () => {
    renderList();

    const parteConPatrocinanteSinDomicilio = {
      ...parteBase,
      patrocinante: {
        nroMatricula: 'MP-777',
        domicilio: 'Calle Falsa 456',
        localidad: '',
      },
    };
    const row = capturedProps.columnBuilder({
      data: parteConPatrocinanteSinDomicilio,
      onDelete: vi.fn(),
    });
    render(<MemoryRouter>{row.columns[0].content}</MemoryRouter>);

    expect(screen.getByText('Calle Falsa 456')).toBeInTheDocument();
  });
});
