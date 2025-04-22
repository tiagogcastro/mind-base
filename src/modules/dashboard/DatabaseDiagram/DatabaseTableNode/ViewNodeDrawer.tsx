import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiTrash, FiX } from 'react-icons/fi';
import { useDatabaseDiagramContext } from '../../contexts/DatabaseDiagramContext';
import { DatabaseTableNodeType } from '../loadDatabaseSchema';

export type ViewNodeDrawerProps = {}

export function ViewNodeDrawer(props: ViewNodeDrawerProps) {
  const { currentNodeSelected, isOpenViewNodeDrawer, setNodes, nodes } = useDatabaseDiagramContext();
  const { isOpen, onClose: handleOnClose } = isOpenViewNodeDrawer;

  const {
    register,
    setValue,
    getValues,
    watch,
    formState,
    handleSubmit,
  } = useForm({
    defaultValues: {
      tableName: currentNodeSelected?.data.tableName,
      fields: currentNodeSelected?.data.fields,
    }
  });

  const { errors } = formState;

  const handleAddNewField = () => {
    const id = crypto.randomUUID();

    const newField = {
      id,
      name: '',
      type: 'string',
      isPrimaryKey: false,
      isForeignKey: false,
      isUnique: false,
    };

    const fields = getValues()?.fields;

    if (fields) {
      setValue('fields', [...fields, newField]);
    } else {
      setValue('fields', [newField]);
    }
  }

  const handleUpdateNode = useCallback(() => {
    const updatedNode = {
      ...currentNodeSelected,
      data: {
        ...currentNodeSelected?.data,
        tableName: getValues('tableName'),
        fields: getValues('fields'),
      }
    }

    const updatedNodes = nodes.map((node) => {
      if (node.id === currentNodeSelected?.id) {
        return updatedNode;
      }
      return node;
    });

    setNodes(() => updatedNodes as DatabaseTableNodeType[]);
    handleOnClose();
  }, [handleOnClose, setNodes, nodes, currentNodeSelected]);

  const handleDeleteField = useCallback((fieldId: string) => {
    const fields = getValues()?.fields;

    if (fields) {
      const updatedFields = fields.filter((field) => field.id !== fieldId);
      setValue('fields', updatedFields);
    }
  }, [setValue, getValues]);

  const handleDeleteNodde = useCallback(() => {
    const tableName = getValues()?.tableName;

    if (tableName) {
      setNodes((prev) => prev.filter((node) => node.data.tableName !== tableName));

      handleOnClose();
    }
  }, [getValues]);

  return (
    <Drawer open={isOpen} onClose={handleOnClose} direction='right'>
      <DrawerContent
        className='bg-gray-800 text-white border-none w-full max-w-[1200px] data-[vaul-drawer-direction=right]:sm:max-w-lg'
      >
        <DrawerHeader
          className='px-6 border-b border-gray-600 bg-gray-700'
        >
          <div className="flex items-center justify-between">
            <DrawerTitle className='text-xl text-gray-100 font-normal flex items-center gap-2'>
              <div className="">
                <span className="">
                  Tabela: {" "}
                </span>
                <span className="font-bold text-white">
                  {currentNodeSelected?.data.tableName}
                </span>
              </div>

              <Button
                onClick={handleDeleteNodde}
                className=' text-gray-100 hover:text-red-400 bg-transparent border-gray-500 border p-2 hover:border-red-400'
              >
                <FiTrash
                  className='w-5 h-5'
                />
              </Button>
            </DrawerTitle>

            <DrawerClose className='text-gray-100 hover:text-white'>
              <FiX className='w-5 h-5' />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <form
          id="update-node-form"
          className="p-6 py-2 max-h-full overflow-y-auto my-4"
          onSubmit={handleSubmit(handleUpdateNode)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-1.5 flex-col">
              <label className="text-sm text-gray-200 flex items-center justify-start gap-1">
                Nome da tabela
              </label>
              <input
                type="text"
                defaultValue={currentNodeSelected?.data.tableName}
                placeholder="Nome da tabela"
                className="bg-gray-600 text-gray-100 p-2 rounded-md placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                {...register('tableName', {
                  required: true,
                })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-md text-gray-50 font-bold">
                Campos:
              </span>
              <div className="flex flex-col gap-4">
                {watch('fields')?.map((field, index) => (
                  <div key={`${field.id}`} className="flex flex-col gap-1.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1 justify-between">
                        <label className="text-sm text-gray-200 flex items-center justify-start gap-1">
                          {field.name}
                          <span className="flex items-center gap-2 text-sm text-gray-100">
                            <span className="italic">
                              ({field.type})
                            </span>
                            <span className="font-bold text-white">
                              {field.isPrimaryKey ? 'PK' : ''}
                              {field.isForeignKey ? 'FK' : ''}
                              {field.isUnique ? 'UQ' : ''}
                            </span>
                          </span>
                        </label>
                        <Button
                          className='w-4 h-4 text-gray-100 hover:text-red-400'
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <FiTrash />
                        </Button>
                      </div>

                      <input
                        type="text"
                        defaultValue={field.name}
                        placeholder="Nome do campo"
                        className="bg-gray-600 text-gray-100 p-2 rounded-md placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        {...register(`fields.${index}.name`, {
                          required: {
                            message: 'Nome do campo é obrigatório',
                            value: true,
                          },
                          minLength: {
                            message: 'Nome do campo deve ter pelo menos 1 caracter',
                            value: 1,
                          },
                          onChange: (e) => {
                            const updatedFields = [...(watch('fields') ?? [])];
                            updatedFields[index].name = e.target.value;
                            setValue('fields', updatedFields, { shouldDirty: true });
                          }
                        })}
                      />

                      {errors?.fields?.[index]?.name && (
                        <span className="text-sm text-red-400">
                          {errors.fields[index].name.message}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-4 bg-gray-600 text-white p-2 rounded-md hover:bg-purple-800 flex items-center gap-2 justify-center transition-all"
              onClick={handleAddNewField}
            >
              <FiPlus />
              Adicionar Campo
            </button>
          </div>
        </form>

        <DrawerFooter className=' border-t border-gray-600 bg-gray-700'>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              className='w-full flex-1 bg-transparent border border-gray-400 text-gray-100 hover:bg-gray-600'
              onClick={handleOnClose}
            >
              Cancelar
            </Button>
            <Button
              form="update-node-form"
              className='w-full flex-1 bg-purple-700'
            >
              Atualizar
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent >
    </Drawer >
  )
}