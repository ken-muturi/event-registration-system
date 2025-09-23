/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, HStack, Select } from '@chakra-ui/react'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import { getOrganizations } from "@/services/Organizations";

export type FilterProps = {
  organizationId?: string;
};

type AFiltersProps = {
  filters: FilterProps;
  setFilters: (d: FilterProps) => void;
};

const Filters = ({ setFilters, filters }: AFiltersProps) => {
  const { data } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      return await getOrganizations();
    },
  });

  return (
    <HStack>
      <Text fontSize="sm">Organization</Text>
      <Select
        borderRadius="md"
        size="xs"
        value={filters.organizationId || ""}
        onChange={(e) => {
          if (e.target.value) {
            setFilters({ ...filters, organizationId: e.target.value });
          } else {
            setFilters(omit(filters, ["organizationId"]));
          }
        }}
      >
        <option value="">All</option>
        {data?.map((b: any) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </Select>
    </HStack>
  );
};

export default Filters