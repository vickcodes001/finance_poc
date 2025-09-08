import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bankAccount',
  title: 'Bank Account',
  type: 'document',
  fields: [
    defineField({
      name: 'monoId',
      title: 'Mono Account ID',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'accountName',
      title: 'Account Name',
      type: 'string',
    }),
    defineField({
      name: 'accountNumber',
      title: 'Account Number',
      type: 'string',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
    }),
    defineField({
      name: 'balance',
      title: 'Balance',
      type: 'number',
    }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'object',
      fields: [
        { name: 'id', type: 'string', title: 'Institution ID' },
        { name: 'name', type: 'string', title: 'Institution Name' },
        { name: 'bankCode', type: 'string', title: 'Bank Code' },
      ]
    }),
    defineField({
      name: 'publicToken',
      title: 'Public Token',
      type: 'string',
    }),
  ],
})
