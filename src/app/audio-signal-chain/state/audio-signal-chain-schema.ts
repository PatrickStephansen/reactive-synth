import { object, array, string, number } from 'yup';

export const audioSignalChainSchemaV1 = object({
  modules: array()
    .required()
    .of(
      object({
        id: string().required(),
        moduleType: string().required(),
        name: string().nullable(),
        sourceIds: array().of(string())
      })
    )
    .test('output-module-has-inputs', 'No output module', modules =>
      modules.some(m => m.id === 'Output to Speakers' && m.moduleType === 'output')
    )
    .test('output-module-has-inputs', 'No sourceIds for output module', modules =>
      modules.some(
        m =>
          m.id === 'Output to Speakers' && m.moduleType === 'output' && Array.isArray(m.sourceIds)
      )
    ),
  parameters: array()
    .required()
    .of(
      object({
        name: string().required(),
        moduleId: string().required(),
        value: number().required(),
        sourceIds: array().of(string())
      })
    ),
  choiceParameters: array()
    .required()
    .of(
      object({
        moduleId: string(),
        name: string(),
        selection: string()
      })
    )
});
